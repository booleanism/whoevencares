import { Environment } from "nunjucks";
import { Config_t } from "../types/config.js";
import { IContent } from "../types/pages.js";
import { Rendering } from "../types/rendering.js";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

export class Index<T extends IContent> implements Rendering {
  private conf: Config_t;
  private contents: T[];

  constructor(conf: Config_t, contents: T[]) {
    this.conf = conf;
    this.contents = contents;
  }

  render<U extends Environment>(template: U): void {
    const outFile = `${this.conf.outDir}/index.html`;

    this.sort();

    this.conf.siteUrl = `${this.conf.secure ? "https://" : "http://"}${this.conf.siteUrl}`

    const ctx = {
      ...this.conf,
      contents: this.contents,
      siteImage: `${this.conf.siteUrl}/${this.conf.assetDir.slice(2)}/${this.conf.siteImage}`
    };
    const res = template.render("index.html.j2", ctx);

    if (!existsSync(this.conf.outDir)) {
      mkdirSync(this.conf.outDir);
    }

    writeFileSync(outFile, res);
  }

  private sort() {
    this.contents.sort(
      (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime(),
    );
  }
}
