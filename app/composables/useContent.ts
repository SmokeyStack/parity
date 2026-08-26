export type ContentEntry = Record<string, any>;
export type ContentCollection =
    | 'features'
    | 'implemented'
    | 'tags-items'
    | 'tags-blocks';

function loadModules(collection: ContentCollection): Record<string, any> {
    switch (collection) {
        case 'features':
            return import.meta.glob('~/content/features/*.yaml', {
                eager: true
            });
        case 'implemented':
            return import.meta.glob('~/content/implemented/*.yaml', {
                eager: true
            });
        case 'tags-items':
            return import.meta.glob('~/content/tags-items/*.yaml', {
                eager: true
            });
        case 'tags-blocks':
            return import.meta.glob('~/content/tags-blocks/*.yaml', {
                eager: true
            });
    }
}

function toEntries(modules: Record<string, any>): ContentEntry[] {
    return Object.entries(modules).map(([file, mod]: [string, any]) => ({
        id: file.replace(/^.*\//, '').replace(/\.yaml$/, ''),
        ...((mod && mod.default) ?? mod)
    }));
}
function timeOf(entry: ContentEntry, dateKey: string): number {
    const value = entry[dateKey];
    if (!value) return -Infinity;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? -Infinity : time;
}
export function useContent(
    collection: ContentCollection,
    dateKey: string = 'date'
): ContentEntry[] {
    const entries = toEntries(loadModules(collection));
    return [...entries].sort((a, b) => timeOf(b, dateKey) - timeOf(a, dateKey));
}
