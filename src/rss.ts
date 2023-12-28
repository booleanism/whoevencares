import { frontmatter } from "./frontmatter.js";
import { Feed } from 'feed'

export namespace rss {
    export function buildRss(indexItems: frontmatter.attr[]): string {
        const feed = new Feed({
            id: 'https://whoevencares.com',
            title: 'whoevencares rss feed',
            copyright: new Date().getFullYear().toString() === '2023' ? '2023 CC BY-NC-SA' : `2023 - ${new Date().getFullYear().toString()} CC BY-NC-SA`,
            link: 'https://whoevencares.com',
            updated: new Date(indexItems[0].publishedDate),
            author: {
                name: 'Mambaul Hisam',
                email: 'hisyamsquartz@gmail.com',
                link: 'https://whoevencares.com/about'
            },

        })

        indexItems.forEach((post) => {
            feed.addItem({
                title: post.title,
                link: post.articleHref,
                date: new Date(post.publishedDate),
                description: post.description
            })
        })
        // console.log(feed)
        return feed.rss2()
    }
}