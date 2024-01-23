import { frontmatter } from "./frontmatter.js";
import { fs } from "./utils/fs.js";
import { config } from "./config/config.js";
import { template } from "./template.js";
import { rss } from "./rss.js";
import { sorting } from "./utils/sorting.js";

const indexItems: frontmatter.attr[] = [];

(async () => {
    const conf = await config.parse();
    fs.createDir(conf.htmlDir);
    fs.createDir(conf.mdDir);

    await main(conf);
})();

async function main(conf:  config.config) {
    
    const mdFiles = await fs.readDir(conf.mdDir, '.md');
    const htmlFiles = await fs.readDir(conf.htmlDir, '.html');

    if (mdFiles.length <= 0) {
        return 0
    } 

    for (const file of mdFiles) {
        const mdContent = await fs.read(`${conf.mdDir}/${file}`);
        const ctx = frontmatter.parse(mdContent);

        if (ctx.articleHref === undefined) {
            throw new Error('href not found');
        }


        if (!htmlFiles.includes(ctx.articleHref) || ctx.draft) {
            const data = template.build(conf, ctx);
            fs.write(`${conf.htmlDir}/${ctx.articleHref}`, data);
        }

        indexItems.push(ctx);
    }

    sorting.date(indexItems);
    fs.write(`${conf.htmlDir}/rss.xml`, rss.buildRss(conf, indexItems))
    fs.write(`${conf.htmlDir}/index.html`, template.build(conf, indexItems));

    return 0
};