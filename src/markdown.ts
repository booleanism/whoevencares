import md from 'markdown-it';

export namespace markdown {
    export function parse(mdNoFm: string): string {
        const parsedMd = md();
        return parsedMd.render(mdNoFm);
    }
}