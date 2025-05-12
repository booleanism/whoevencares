import fm from "front-matter";
import { PathLike, readFileSync } from "fs";
import { IContent } from "../types/pages.js";
import md from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";

export class Markdown<T extends IContent> {
  private path: PathLike;

  constructor(path: PathLike) {
    this.path = path;
  }

  evaluate(): T {
    const md_str = readFileSync(this.path, { encoding: "utf-8" });
    const fMatter = fm(md_str, { allowUnsafe: true });
    const attributes = fMatter.attributes as T;

    if (!attributes.publishedDate) {
      throw new Error(`${attributes.title} publishedDate must be set`);
    }

    if (!attributes.description) {
      throw new Error(`${attributes.title} description must be set`);
    }

    if (!attributes.draft) {
      attributes.draft = false;
    }

    const parsedFm: T = {
      ...attributes,
      publishedDate: new Date(attributes.publishedDate),
      writeUp: this.parse(fMatter.body),
      url: this.genUrl(attributes.title),
    };

    return parsedFm;
  }

  private parse(mdNoFm: string): string {
    const parsedMd = md();
    parsedMd.use(markdownItAttrs, {
      leftDelimiter: "{",
      rightDelimiter: "}",
      allowedAttributes: [],
    });
    return parsedMd.render(mdNoFm);
  }

  private genUrl(title: string): string {
    return title
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-_]/g, "")
      .concat(".html")
      .toLocaleLowerCase();
  }
}
