import { readFile } from "fs/promises";

interface TemplateConfig {
  content: string;
  thumbnail: string;
}

interface IndexingConfig {
  url: string;
  name: string;
  description: string;
  copyright: number;
  thumbnail: string;
  rss: boolean;
  robots: boolean;
}

interface AuthorConfig {
  name: string;
  email: string;
  link: string;
}

export interface Configable<T extends Configuration> {
  getConfig(): Promise<T>;
}

export interface Configuration extends Configable<Configuration> {
  https: boolean;
  template: TemplateConfig;
  contentDir: string;
  outDir: string;
  assetsDir: string;
  staticDir: string;
  indexing: IndexingConfig;
  author: AuthorConfig;
}

const configPath = "wec.json";

export async function parseConfig(): Promise<Configuration> {
  const conFile = readFile(configPath, { encoding: "utf-8" });
  const c = JSON.parse(await conFile) as Configuration;
  const conf = {
    ...c,
    indexing: {
      ...c.indexing,
      url: `${urlScheme(c)}${c.indexing.url}`,
    },
  };

  return {
    ...conf,
    getConfig: async () => conf,
  };
}

function urlScheme(conf: Configuration): string {
  return conf.https ? "https://" : "http://";
}
