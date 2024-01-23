import { config } from "./config/config.js";
import { frontmatter } from "./frontmatter.js";
import njs from 'nunjucks';
import { fs } from "./utils/fs.js";

export namespace template {
    export function build(templateInfo: config.config, context: frontmatter.attr | frontmatter.attr[]): string {
        const env = new njs.Environment(new njs.FileSystemLoader(templateInfo.template.dir), {autoescape: false});

        let templateObj = null;
        let rendered = null;

        if (Array.isArray(context)) {
            templateObj = {
                items: context,
                homeUrl: templateInfo.url,
                articleImage: `${templateInfo.url}/${fs.extractFileName(templateInfo.defaultArticleImagePath)}`,
                description: templateInfo.blogDescription,
            }
            rendered = env.render(templateInfo.template.index, templateObj);
            return rendered;
        }
        templateObj = {
            title: context.title,
            articleHref: `${templateInfo.url}/${context.articleHref}`,
            description: context.description,
            author: context.author,
            publishedDate: context.publishedDate,
            articleContent: context.articleContent,
            articleImage: `${templateInfo.url}/${fs.extractFileName(templateInfo.defaultArticleImagePath)}`,
        }

        rendered = env.render(templateInfo.template.article, templateObj);
        return rendered;
    }
}