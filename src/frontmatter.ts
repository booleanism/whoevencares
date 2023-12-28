import fm from 'front-matter';
import { generator } from './utils/generator.js';
import { markdown } from './markdown.js';

export namespace frontmatter {
    export type attr = {
        title: string,
        author: string,
        publishedDate: string,
        draft: boolean,
        articleHref?: string,
        articleContent?: string,
    }

    export function parse(md_file: string): attr {
        const fMatter = fm(md_file, {allowUnsafe: true});
        const attributes = fMatter.attributes as attr; 
        
        if (!attributes.publishedDate) {
            attributes.publishedDate = new Date().toDateString();
        }

        if (attributes.draft === undefined) {
            attributes.draft = false;
        }

        if (!attributes.articleHref) {
            attributes.articleHref = generator.genHref(attributes.title).replace(' ', '-');
        }

        const parsedFm: attr = {
            author: attributes.author,
            draft: attributes.draft,
            publishedDate: attributes.publishedDate,
            title: attributes.title,
            articleContent: markdown.parse(fMatter.body),
            articleHref: attributes.articleHref
        }

        return parsedFm;
    }
}