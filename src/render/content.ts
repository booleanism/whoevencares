import { Environment, Template } from "nunjucks";
import { Configuration } from "../parser/config";
import { PageRendering } from "./render";
import { Configable } from "../parser/config";
import { Path, PathType } from "../path";
import { readFile, writeFile } from "fs/promises";
import { thumbImpl } from "./thumbnail";
import { parseMarkdown } from "../parser/frontmatter";
import { PageSetup } from "../prior";

export const CONTENT_HTML_OUT_DIR = "posts/";
export const RPM_CONST = 230;

interface ContentContext {
  title: string;
  author: string;
  description: string;
  publishedDate: Date;
  draft: boolean;
  tags: string[];
  writeUp: string;
  url: string;
  thumbnail: string;
  rpm: number;
}

export interface Markdown extends ContentContext {
  path: string;
  writeUp: string;
}

interface ContentRendering<T> extends PageRendering {
  metas(): T[];
}

export async function newContent<T extends Markdown>(
  config: Configable<Configuration>,
  template: Environment,
  mdFilesPath: string[],
): Promise<ContentRendering<T>> {
  const conf = await config.getConfig();
  const metas: Array<T> = new Array<T>();
  for (const mdFile of mdFilesPath) {
    const mdData = await readFile(mdFile, "utf-8");
    const parsed = await (await parseMarkdown<T>(mdData)).getContext();

    if (parsed.draft) {
      continue;
    }

    const contentDir = `${genUrl(parsed.title)}`;
    const htmlContentPath = await new Path(conf.outDir)
      .join(CONTENT_HTML_OUT_DIR)
      .create(PathType.Dir);
    await new Path(htmlContentPath).join(contentDir).create(PathType.Dir);
    parsed.url = `${conf.indexing.url}/${CONTENT_HTML_OUT_DIR}${contentDir}/`;
    parsed.path = `${htmlContentPath}${contentDir}/`;

    metas.push(parsed);
  }

  return {
    done: async () => {},
    metas: () => metas,
    render: renderImpl<T>(
      await config.getConfig(),
      template.getTemplate("content.html.j2"),
    ),
  };
}

function renderImpl<T extends Markdown>(
  config: Configuration,
  template: Template,
): <U>(ctxs: U[]) => Promise<void> {
  return async <U>(ctxs: U[]): Promise<void> => {
    for (const c of ctxs) {
      setup(config, c as unknown as T).then(async (page) => {
        await writeFile(
          page.ctx.path + "index.html",
          template.render(page.ctx),
          {
            encoding: "utf-8",
          },
        );
        page.applyThumbnail();
      });
    }
  };
}

async function setup<T extends Markdown>(
  conf: Configuration,
  ctx: T,
): Promise<PageSetup<T>> {
  const thumbUrlMutator = (thumbPath: string) => {
    ctx.thumbnail = `${conf.indexing.url}/${thumbPath}`;
  };

  const hijackedAssetsPath = new Path(conf.assetsDir)
    .join(CONTENT_HTML_OUT_DIR)
    .toString();
  return new Promise((res) => {
    res({
      ctx: ctx,
      applyThumbnail: thumbImpl(
        conf,
        hijackedAssetsPath,
        `${genUrl(ctx.title)}.html`,
        ctx,
        thumbUrlMutator,
      ),
    });
  });
}

function genUrl(title: string): string {
  return title
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_]/g, "")
    .toLocaleLowerCase();
}
