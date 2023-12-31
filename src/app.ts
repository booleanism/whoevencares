import { frontmatter } from "./frontmatter.js";
import { fs } from "./utils/fs.js";
import { config } from "./config/template.js";
import { template } from "./template.js";
import { rss } from "./rss.js";

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
    const mdFiles = await fs.readDir(defaultConfig.mdDir, '.md');
    const htmlFiles = await fs.readDir(defaultConfig.htmlDir, '.html');

    if (mdFiles.length <= 0) {
        return 0
    } 

    for (const file of mdFiles) {
        const mdContent = await fs.read(`${defaultConfig.mdDir}/${file}`);
        const ctx = frontmatter.parse(mdContent);

        if (ctx.articleHref === undefined) {
            throw new Error('href not found');
        }


        if (!htmlFiles.includes(ctx.articleHref) || ctx.draft) {
            const data = template.build(defaultConfig, ctx, false);
            fs.write(`${defaultConfig.htmlDir}/${ctx.articleHref}`, data);
        }

        indexItems.push(ctx);
    }
    // sort by date
    indexItems.sort((a, b) => {
        return new Date(b.publishedDate).getDate() - new Date(a.publishedDate).getDate()
    })

    fs.write(`${defaultConfig.htmlDir}/rss.xml`, rss.buildRss(indexItems))
    fs.write(`${defaultConfig.htmlDir}/index.html`, template.build(defaultConfig, indexItems, true));

    return 0
}

init();
startUp();