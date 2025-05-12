import { Environment } from "nunjucks";
import { Config_t } from "../types/config.js";
import { IContent } from "../types/pages.js";
import { Rendering } from "../types/rendering.js";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";

export class Content<T extends IContent> implements Rendering {
  conf: Config_t;
  content: T;

  constructor(conf: Config_t, content: T) {
    this.conf = conf;
    this.content = content;
  }

  render<U extends Environment>(template: U): void {
    const outFile = `${this.conf.outDir}/${this.content.url}`;
    const ctx: T = {
      ...this.content,
      url: `${this.conf.siteUrl}/${this.content.url}`,
      ilust: `${this.conf.siteUrl}/${this.content.ilust}`
    }

    const res = template.render("content.html.j2", ctx);

    if (!existsSync(this.conf.outDir)) {
      mkdirSync(this.conf.outDir);
    }

    writeFileSync(outFile, res);
  }
}
