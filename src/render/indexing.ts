import { Environment, Template } from "nunjucks";
import { Configable, Configuration } from "../parser/config";
import { Markdown } from "./content";
import { PageRendering } from "./render";
import { PageSetupIndex } from "../prior";
import { thumbImpl } from "./thumbnail";
import { Path, PathType } from "../path";
import { writeFile } from "fs/promises";
import { newRss, RssFeed } from "./rss";
import { TAGS_DIR } from "./tagging";

const htmlFileName = "index.html";

interface IndexingContext<T extends Markdown> {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  copyright: number;
  contents: T[];
  host: string;
}

export interface Indexing<T extends Markdown> extends IndexingContext<T> {
  rss?: RssFeed;
  basePath: string;
  indexPath: string;
  assetsPath: string;
  tagPath: string;
}

export async function newIndexContext<T extends Markdown>(
  conf: Configable<Configuration>,
  contents: T[],
): Promise<Indexing<T>> {
  const c = await conf.getConfig();
  contents.sort(
    (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime(),
  );

  return {
    host: `${c.indexing.url}`,
    title: c.indexing.name,
    description: c.indexing.description,
    url: `${c.indexing.url}/${htmlFileName}`,
    thumbnail: "",
    basePath: "./",
    indexPath: `${htmlFileName}`,
    assetsPath: c.assetsDir,
    tagPath: TAGS_DIR,
    copyright: c.indexing.copyright,
    contents: contents,
  };
}

export async function newIndexContextWithRss<T extends Markdown>(
  conf: Configable<Configuration>,
  contents: T[],
): Promise<Indexing<T>> {
  return {
    ...(await newIndexContext(conf, contents)),
    rss: await newRss(conf),
  };
}

export async function newIndex<T extends Markdown>(
  conf: Configable<Configuration>,
  template: Environment,
): Promise<PageRendering> {
  return {
    done: async () => {},
    render: renderImpl<T>(
      await conf.getConfig(),
      template.getTemplate("index.html.j2"),
    ),
  };
}

function renderImpl<T extends Markdown>(
  conf: Configuration,
  template: Template,
): <U>(ctx: U[]) => Promise<void> {
  return async <U>(c: U[]) => {
    for (const i of c as unknown[] as Indexing<T>[]) {
      setup(conf, i).then((page) => {
        writeFile(
          page.ctx.basePath + page.ctx.indexPath,
          template.render(page.ctx),
          { encoding: "utf-8" },
        );
        page.applyThumbnail();
        page.renderRss();
      });
    }
  };
}

async function setup<U extends Markdown, T extends Indexing<U>>(
  conf: Configuration,
  ctx: T,
): Promise<PageSetupIndex<T>> {
  await new Path(ctx.basePath).create(PathType.Dir);
  const path = ctx.basePath.replace("./", conf.outDir);
  const c = {
    ...ctx,
    basePath: `${path}`,
    url: `${ctx.url}`,
    author: conf.author.name,
    title: ctx.title,
    publishedDate: new Date(),
    rpm: "\u{221E}",
  };
  const thumbPathMutator = (path: string) => {
    c.thumbnail = `${conf.indexing.url}/${path}`;
  };

  return new Promise((res) => {
    res({
      ctx: c,
      applyThumbnail: thumbImpl(
        conf,
        c.assetsPath,
        htmlFileName,
        c,
        thumbPathMutator,
      ),
      renderRss: renderRssImpl(c),
    });
  });
}

function renderRssImpl<U extends Markdown, T extends Indexing<U>>(
  ctx: T,
): () => Promise<void> {
  return async () =>
    new Promise((res) => {
      if (ctx.rss) {
        for (const r of ctx.contents) {
          const rss: typeof r = {
            ...r,
            content: r.writeUp,
          };
          ctx.rss.add(rss);
        }
      }
      (async () => {
        if (ctx.rss) {
          for await (const r of ctx.rss.render()) {
            writeFile(`${ctx.basePath}rss.xml`, r, "utf-8");
          }
        }
      })();
      res();
    });
}
