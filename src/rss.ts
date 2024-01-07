import { config } from "./config/config.js";
import { frontmatter } from "./frontmatter.js";
import { Feed } from 'feed'

export namespace rss {
    export function buildRss(conf: config.config, indexItems: frontmatter.attr[]): string {
        const feed = new Feed({
            id: conf.url,
            title: `${conf.blogsName}'s rss feed`,
            copyright: conf.copyright,
            link: conf.url,
            updated: new Date(indexItems[0].publishedDate),
            author: conf.author,
            description: conf.blogDescription

        })

        indexItems.forEach((post) => {
            feed.addItem({
                title: post.title,
                link: post.articleHref,
                date: new Date(post.publishedDate),
                description: post.description
            })
        })

        return feed.rss2()
    }
}