import { frontmatter } from "./frontmatter.js";

export namespace context {
    export function article(fm: frontmatter.FM): frontmatter.attr {
        const attr: frontmatter.attr = {
            author: fm.attibutes.author,
            draft: fm.attibutes.draft,
            publishedDate: fm.attibutes.publishedDate,
            title: fm.attibutes.title,
            articleContent: fm.htmlBody,
            articleHref: fm.attibutes.articleHref
        }

        return attr;
    }
}