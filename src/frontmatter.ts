import fm from 'front-matter';
import { generator } from './utils/generator.js';
import { markdown } from './markdown.js';
// var fm = require('front-matter');

export namespace frontmatter {
    export type attr = {
        title: string,
        author: string,
        publishedDate: string,
        draft: boolean,
        articleHref?: string,
        articleContent?: string,
        htmlBody: string
    }

    export type FM = {
        attibutes: attr
        htmlBody: string
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
            // console.log(attributes.articleHref);
        }

        // const parsedFm: FM = {
        //     attibutes: attributes,
        //     htmlBody: markdown.parse(fMatter.body)
        // }
        const parsedFm: attr = {
            author: attributes.author,
            draft: attributes.draft,
            htmlBody: markdown.parse(fMatter.body),
            publishedDate: attributes.publishedDate,
            title: attributes.title,
            articleContent: attributes.articleContent,
            articleHref: attributes.articleHref
        }

        return parsedFm;
    }
}