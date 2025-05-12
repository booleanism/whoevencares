import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { Config_t } from "../types/config.js";
import { Markdown } from "../parser/markdown.js";
import { IContent } from "../types/pages.js";
import { Rendering } from "../types/rendering.js";
import { Index } from "./index.js";
import { Content } from "./content.js";
import { Template } from "./template.js";
import sharp from "sharp";
import { Feed } from "feed";

export class Pages<T extends IContent> implements Rendering {
  conf: Config_t;
  contents: T[] = [];
  template: Template;

  constructor(conf: Config_t) {
    this.conf = conf;
    this.template = new Template(conf);
  }

  build(options: { inclDraft: boolean } = { inclDraft: false }) {
    const mdPath = readdirSync(this.conf.contentDir, { encoding: "utf-8" });

    for (const cont of mdPath) {
      const mdExt = cont.split(".");
      if (mdExt[mdExt.length - 1].toLowerCase() !== "md") {
        continue;
      }

      const md = new Markdown(`${this.conf.contentDir}/${cont}`).evaluate();

      if (!options.inclDraft && md.draft) {
        continue;
      }

      const url = `${this.conf.siteUrl}/${md.url}`

      const content = {
        ...md,
        url: this.conf.secure ? `https://${url}` : `http://${url}`,
      }

      this.contents.push(md as T);
    }

    return this;
  }

  withIndex() {
    new Index(this.conf, this.contents).render(this.template);

    return this;
  }

  render() {
    for (const cont of this.contents) {
      cont.ilust = this.generateIlust(cont).replace("./", "");
      new Content(this.conf, cont).render(this.template);
    }

    return this;
  }

  done() {
    const staticDir = readdirSync(this.conf.staticDir);

    for (const i of staticDir) {
      if (!this.conf.enableRobotTxt || !this.conf.enableRss) {
        continue;
      }

      this.buildRss();
      cpSync(`${this.conf.staticDir}/${i}`, `${this.conf.outDir}/${i}`);
    }

    const assetDir = `${this.conf.outDir}/${this.conf.assetDir}`;
    if (!existsSync(assetDir)) {
      mkdirSync(assetDir);
    }

    cpSync(`${this.conf.assetDir}`, assetDir, {
      recursive: true,
    });
  }

  private generateIlust<C extends IContent>(content: C) {
    const ilustPath = `${this.conf.assetDir}/${content.url.replace(".html", ".jpg")}`;

    sharp(`${this.conf.templateDir}/${this.conf.ilustTemplate}`)
      .composite([
        {
          input: {
            text: {
              text: `${content.title}`,
              font: "JetBrains Mono",
              width: 1000,
              align: "left",
              dpi: 650,
            },
          },
          top: 340,
          left: 1150,
        },
        {
          input: {
            text: {
              text: `${this.conf.siteUrl}/${content.url}`,
              font: "JetBrains Mono",
              width: 2040,
              dpi: 250,
              align: "left",
            },
          },
          left: 180,
          top: 1080,
        },
        {
          input: {
            text: {
              text: `${content.publishedDate.toDateString()}`,
              font: "JetBrains Mono",
              align: "right",
              width: 600,
              dpi: 250,
            },
          },
          left: 1900,
          top: 100,
        },
      ])
      .toFile(ilustPath);

    return ilustPath;
  }

  private buildRss() {
    const feed = new Feed({
      id: this.conf.siteUrl,
      title: `${this.conf.siteName}'s rss feed`,
      copyright: this.conf.copyright,
      link: this.conf.siteUrl,
      updated: new Date(this.contents[0].publishedDate),
      author: this.conf.siteAuthor,
      description: this.conf.siteDescription,
    });

    this.contents.forEach((post) => {
      feed.addItem({
        title: post.title,
        link: post.url,
        date: new Date(post.publishedDate),
        description: post.description,
      });
    });

    writeFileSync(`${this.conf.outDir}/rss.xml`, feed.rss2());
  }
}
