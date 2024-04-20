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

    // for (const file of htmlFiles) {}

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
    // sort by date
    indexItems.sort((a, b) => {
        return new Date(b.publishedDate).getDate() - new Date(a.publishedDate).getDate()
    })

    let href = [];
    for (const c of indexItems) {
        href.push(c.articleHref);
    }
    // indexItems[] 

    for (const i of htmlFiles) {
        if (!isIncluded(href, i)) {
            fs.delFile(i);
        }
    }

    sorting.date(indexItems);
    fs.write(`${conf.htmlDir}/rss.xml`, rss.buildRss(conf, indexItems))
    fs.write(`${conf.htmlDir}/index.html`, template.build(conf, indexItems));

    return 0
};

function isIncluded(strs: string[], search: string): boolean {
    let con = [true];
    for (const i of strs) {
        if (i === search) {
            // con.push(i !== search);
            // return con = i === search && true;
            return true;
        }
    }

    return false;
}