import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'app', 'content');
const CATEGORIES = ['add-ons', 'commands', 'general'];
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;

function isIsoDate(value) {
    return ISO_DATE_RE.test(value);
}
function hasOnlyCodeTags(text) {
    const tags = text.match(/<[^>]*>/g) ?? [];
    return tags.every((tag) => tag === '<code>' || tag === '</code>');
}

const markupString = z.string().refine(hasOnlyCodeTags, {
    message: 'markup is limited to <code> and </code> tags only'
});
const titleString = markupString.refine((s) => s === s.trim(), {
    message: 'title must not have leading or trailing whitespace'
});
const descriptionRequired = z.union([
    markupString,
    z.array(markupString).min(1)
]);
const descriptionOptional = descriptionRequired.optional();
const featureDate = z.union([
    z.literal(''),
    z.string().refine(isIsoDate, {
        message:
            'date must be YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD (or "" for undocumented)'
    })
]);
const isoDateString = (label) =>
    z.string().refine(isIsoDate, {
        message: `${label} must be YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD`
    });
const sourceUrl = z.url({ protocol: /^https?$/ });
const sourceOptional = z
    .union([sourceUrl, z.array(sourceUrl).min(1)])
    .optional();
const featureSchema = z.object({
    category: z.enum(CATEGORIES),
    date: featureDate,
    title: titleString,
    description: descriptionRequired,
    source: sourceOptional
});
const implementedSchema = z
    .object({
        category: z.enum(CATEGORIES),
        introduced: isoDateString('introduced'),
        implemented: isoDateString('implemented'),
        title: titleString,
        description: descriptionOptional,
        source: sourceOptional
    })
    .refine(
        (entry) => new Date(entry.implemented) >= new Date(entry.introduced),
        {
            message: 'implemented must be on or after introduced',
            path: ['implemented']
        }
    );
const tagSchema = z.object({
    date: isoDateString('date'),
    title: titleString,
    description: descriptionRequired,
    source: sourceOptional
});
const COLLECTIONS = [
    { dir: 'features', schema: featureSchema },
    { dir: 'implemented', schema: implementedSchema },
    { dir: 'tags-items', schema: tagSchema },
    { dir: 'tags-blocks', schema: tagSchema }
];

function formatZodError(error) {
    return error.issues
        .map(
            (issue) =>
                `    - ${issue.path.join('.') || '(root)'}: ${issue.message}`
        )
        .join('\n');
}

let totalFiles = 0;
let totalErrors = 0;
const report = [];

for (const { dir, schema } of COLLECTIONS) {
    const collectionDir = path.join(contentDir, dir);
    let files;
    try {
        files = readdirSync(collectionDir).filter((f) => f.endsWith('.yaml'));
    } catch {
        report.push(`✗ app/content/${dir}: directory not found`);
        totalErrors++;
        continue;
    }

    let collectionErrors = 0;
    const seen = new Map();
    for (const file of files) {
        totalFiles++;
        const filePath = path.join(collectionDir, file);
        let data;
        try {
            data = YAML.parse(readFileSync(filePath, 'utf8'));
        } catch (err) {
            totalErrors++;
            collectionErrors++;
            report.push(
                `[FAIL] app/content/${dir}/${file}\n    - failed to parse YAML: ${err.message}`
            );
            continue;
        }

        const result = schema.safeParse(data);
        if (!result.success) {
            totalErrors++;
            collectionErrors++;
            report.push(
                `[FAIL] app/content/${dir}/${file}\n${formatZodError(result.error)}`
            );
            continue;
        }

        const key = `${data.title}|${data.date ?? data.introduced ?? ''}`;
        const prior = seen.get(key);
        if (prior) {
            totalErrors++;
            collectionErrors++;
            report.push(
                `[FAIL] app/content/${dir}/${file}\n    - duplicate of app/content/${dir}/${prior} (same title and date)`
            );
        } else {
            seen.set(key, file);
        }
    }

    console.log(
        `${collectionErrors === 0 ? '[PASS]' : '[FAIL]'} app/content/${dir}: ${files.length} file(s), ${collectionErrors} error(s)`
    );
}

if (totalErrors > 0) {
    console.error('\nValidation errors:\n');
    console.error(report.join('\n\n'));
    console.error(
        `\n${totalErrors} error(s) across ${totalFiles} file(s) in ${COLLECTIONS.length} collection(s).`
    );
    process.exit(1);
}

console.log(
    `\nAll ${totalFiles} content file(s) across ${COLLECTIONS.length} collection(s) are valid.`
);
