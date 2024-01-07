import { config } from "./config/config.js";
import { frontmatter } from "./frontmatter.js";
import njs from 'nunjucks';

export namespace template {
    export function build(templateInfo: config.config, context: frontmatter.attr | frontmatter.attr[], isIndex: boolean): string {
        const env = new njs.Environment(new njs.FileSystemLoader(templateInfo.template.dir), {autoescape: false});

        if (isIndex) {
            const rendered = env.render(templateInfo.template.index, {items: context});
            return rendered;
        }

        const rendered = env.render(templateInfo.template.article, context);
        return rendered;
    }
}