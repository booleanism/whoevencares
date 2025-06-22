import { Configable, Configuration } from "../parser/config";
import { Feed } from "feed";
import { Markdown } from "./content";
import { Rendering } from "./render";

export interface RssFeed extends Rendering {
  add<T extends Markdown>(item: T): Promise<void>;
}

export interface RssRendering {
  applyRss(): Promise<void>;
}

export async function newRss(
  config: Configable<Configuration>,
): Promise<RssFeed> {
  const conf = await config.getConfig();
  const feed = new Feed({
    id: conf.indexing.url,
    title: conf.indexing.name,
    description: conf.indexing.description,
    link: conf.indexing.url,
    author: conf.author,
    image: `${conf.indexing.url}/${conf.assetsDir}index.jpg`,
    favicon: `${conf.indexing.url}/favicon.ico`,
    copyright: conf.indexing.copyright.toString(),
  });

  return {
    add: addItemImpl(feed),
    render: renderImpl(feed),
    done: async () => {},
  };
}

function addItemImpl<T extends Markdown>(
  feed: Feed,
): (ctx: T) => Promise<void> {
  return async (ctx: T): Promise<void> => {
    const c = {
      ...ctx,
      link: ctx.url,
      date: ctx.publishedDate,
      author: [
        {
          name: ctx.author,
        },
      ],
    };

    feed.addItem(c);
  };
}

function renderImpl(feed: Feed): () => Promise<string>[] {
  return (): Promise<string>[] => {
    return [new Promise((res) => res(feed.rss2()))];
  };
}
