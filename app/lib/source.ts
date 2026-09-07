export interface SourceRef {
    url: string;
    label: string;
}

const HOST_LABELS: Array<[RegExp, string]> = [
    [/(^|\.)minecraft\.wiki$/, 'Minecraft Wiki'],
    [/^feedback\.minecraft\.net$/, 'Minecraft Feedback'],
    [/(^|\.)minecraft\.net$/, 'minecraft.net'],
    [/^bugs\.mojang\.com$/, 'Mojang Bug Tracker'],
    [/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube']
];

export function describeSource(url: string): SourceRef {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return { url, label: url };
    }
    const host = parsed.hostname.replace(/^www\./, '');

    if (/^(mobile\.)?(x|twitter)\.com$/.test(host)) {
        const handle = parsed.pathname.match(
            /^\/([A-Za-z0-9_]+)\/status\//
        )?.[1];
        return { url, label: handle ? `X (@${handle})` : 'X' };
    }
    for (const [pattern, label] of HOST_LABELS) {
        if (pattern.test(host)) return { url, label };
    }
    return { url, label: host };
}

export function normalizeSources(source: unknown): SourceRef[] {
    if (typeof source === 'string') return [describeSource(source)];
    if (Array.isArray(source)) {
        return source
            .filter((s): s is string => typeof s === 'string')
            .map(describeSource);
    }
    return [];
}
