import { Configable, Configuration } from "../parser/config";
import { Path, PathType } from "../path";
import { Indexing } from "./indexing";
import { Markdown } from "./content";

export const TAGS_DIR = "tags/";

type TaggingContext<T extends Markdown> = Indexing<T>;

export async function NewTaggingContext<T extends Markdown>(
  config: Configable<Configuration>,
  indexingCtx: Indexing<T>,
): Promise<TaggingContext<T>[]> {
  const conf = await config.getConfig();
  return new Promise((res) => {
    res(setup(conf, indexingCtx));
  });
}

async function setup<T extends Markdown>(
  conf: Configuration,
  indexingCtx: Indexing<T>,
): Promise<Array<TaggingContext<T>>> {
  const tag = tagsToMap(indexingCtx);
  const indexPath = await new Path(conf.outDir).create(PathType.Dir);
  const tagPath = await new Path(indexPath).join(TAGS_DIR).create(PathType.Dir);
  const ctx: Array<TaggingContext<T>> = [];
  tag.forEach((val, key) => {
    ctx.push({
      host: `${conf.indexing.url}`,
      title: `Find out content tagged as ${key} on ${conf.indexing.url}`,
      contents: val,
      copyright: conf.indexing.copyright,
      description: conf.indexing.description,
      url: `${conf.indexing.url}/${TAGS_DIR}${key}/`,
      tagPath: TAGS_DIR,
      basePath: `${tagPath}${key}/`,
      assetsPath: `${conf.assetsDir}${TAGS_DIR}${key}/`,
      indexPath: "index.html",
      thumbnail: "",
    });
  });

  return ctx;
}

function tagsToMap<T extends Markdown>(
  indexingCtx: Indexing<T>,
): Map<string, T[]> {
  const tagsMap: Map<string, T[]> = new Map();
  for (const content of indexingCtx.contents) {
    if (!content.tags) {
      continue;
    }

    for (const tag of content.tags) {
      const temp = tagsMap.get(tag);
      if (temp !== undefined) {
        temp.push(content);
      } else {
        tagsMap.set(tag, [content]);
      }
    }
  }

  return tagsMap;
}
