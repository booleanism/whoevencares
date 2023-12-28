import md from 'markdown-it';
var markdownItAttrs = require('markdown-it-attrs');

export namespace markdown {
    export function parse(mdNoFm: string): string {
        const parsedMd = md();
        parsedMd.use(markdownItAttrs, {
            leftDelimiter: '{',
            rightDelimiter: '}',
            allowedAttributes: []
        })
        return parsedMd.render(mdNoFm);
    }
}