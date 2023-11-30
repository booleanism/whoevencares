import { frontmatter } from "./frontmatter.js";
import { fs } from "./utils/fs.js";
import { config } from "./config/template.js";
import { context } from "./context.js";
import { template } from "./template.js";

const defaultConfig: config.template.templateInfo = {
    htmlDir: './public',
    mdDir: './posts',
    template: {
        dir: './templates',
        index: 'index.html.j2',
        article: 'article.html.j2'
    }
}

const indexItems: frontmatter.attr[] = [];

function init() {
    fs.createDir(defaultConfig.htmlDir);
    fs.createDir(defaultConfig.mdDir);
}

async function startUp() {
    const mdFiles = await fs.readDir(defaultConfig.mdDir);
    const htmlFiles = await fs.readDir(defaultConfig.htmlDir);

    if (mdFiles.length > 0) {
        for (const file of mdFiles) {
            const mdContent = await fs.read(`${defaultConfig.mdDir}/${file}`);
            const fm = frontmatter.parse(mdContent);

            const indexItem = context.article(fm);

            if (indexItem.articleHref === undefined) {
                throw new Error('href not found');
            }


            if (!htmlFiles.includes(indexItem.articleHref) || !fm.attibutes.draft) {
                const ctx = context.article(fm);

                const data = template.build(defaultConfig, ctx, false);

                fs.write(`${defaultConfig.htmlDir}/${indexItem.articleHref}`, data);
            }

            indexItems.push(indexItem);
        }

        fs.write(`${defaultConfig.htmlDir}/index.html`, template.build(defaultConfig, indexItems, true));
    }
}

init();
startUp();