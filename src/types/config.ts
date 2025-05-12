import { PathLike } from "fs";

export interface IParser<T> {
  path: PathLike;
  parse: () => T | undefined;
}

export type Markdown_t = string;

export interface Config_t {
  templateDir: string;
  templates: Templates_t;
  assetDir: string;
  staticDir: string;
  contentDir: string;
  outDir: string;
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  siteAuthor: {
    name: string;
    email: string;
    link: string;
  };
  siteImage: string;
  copyright: string;
  enableRobotTxt: boolean;
  enableRss: boolean;
  secure: boolean;
  ilustTemplate: string;
}

export interface Templates_t {
  base: string;
  index: string;
  content: string;
}
