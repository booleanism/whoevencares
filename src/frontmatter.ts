import fm from 'front-matter';
import { generator } from './utils/generator.js';
import { markdown } from './markdown.js';

export namespace frontmatter {
    export type attr = {
        title: string,
        author: string,
        publishedDate: string | Date,
        description: string,
        draft: boolean,
        articleHref: string,
        articleContent: string,
    }

    export function parse(md_file: string): attr {
        const fMatter = fm(md_file, {allowUnsafe: true});
        const attributes = fMatter.attributes as attr; 
        
        if (!attributes.publishedDate) {
            throw new Error(`${attributes.title} publishedDate must be set`);
        }

        if (!attributes.description) {
            throw new Error(`${attributes.title} description must be set`);
        }

        if (!attributes.draft) {
            attributes.draft = false;
        }

        if (!attributes.articleHref) {
            attributes.articleHref = generator.genHref(attributes.title);
        }

        const parsedFm: attr = {
            author: attributes.author,
            draft: attributes.draft,
            publishedDate: new Date(attributes.publishedDate).toDateString(),
            title: attributes.title,
            articleContent: markdown.parse(fMatter.body),
            articleHref: attributes.articleHref,
            description: attributes.description
        }

        return parsedFm;
    }
}