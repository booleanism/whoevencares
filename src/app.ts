import { cp, readdir, rm } from "fs/promises";
import { Configable, Configuration, parseConfig } from "./parser/config";
import { LastStep, Prior } from "./prior";
import { newTemplate } from "./template";
import { Environment } from "nunjucks";
import { newContent } from "./render/content";
import { newIndex, newIndexContextWithRss } from "./render/indexing";
import { NewTaggingContext } from "./render/tagging";

type AppConfig<T extends Configuration> = Configable<T>;

async function lastStep(conf: Configuration): Promise<void> {
  cp(conf.staticDir, conf.outDir, { recursive: true, force: true });
}

async function setup(): Promise<Prior> {
  const c = await parseConfig();

  const conf: AppConfig<Configuration> = {
    getConfig: async (): Promise<Configuration> => {
      return c;
    },
  };

  const template = await newTemplate(conf);
  try {
    await rm((await conf.getConfig()).outDir, { recursive: true });
  } catch {
    lastStep(await conf.getConfig());
  }

  return {
    conf: () => conf,
    main: (): Promise<LastStep> => main(conf, template),
  };
}

async function main<T extends Configuration>(
  config: AppConfig<T>,
  template: Environment,
): Promise<LastStep> {
  const conf = await config.getConfig();
  const dir = await readdir(conf.contentDir, {
    encoding: "utf-8",
  });

  const contentDir: Array<string> = [];
  for (const i of dir) {
    contentDir.push(`${conf.contentDir}${i}`);
  }

  newContent(conf, template, contentDir).then(async (content) => {
    const metas = content.metas();
    content.render(metas);
    const indexContext = await newIndexContextWithRss(conf, metas);
    newIndex(conf, template).then((index) => {
      index.render([indexContext]);
    });

    const tagsContext = await NewTaggingContext(conf, indexContext);
    newIndex(conf, template).then((indexTag) => {
      indexTag.render(tagsContext);
    });
  });

  return {
    done: lastStep,
  };
}

setup().then((app) => {
  app.main().then(async (lastStep) => {
    lastStep.done(await app.conf().getConfig());
  });
});
