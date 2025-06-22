import fm from "front-matter";
import mdIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import { RenderingContext } from "../render/context";
import { Markdown, RPM_CONST } from "../render/content";

export async function parseMarkdown<T extends Markdown>(
  mdFileContent: string,
): Promise<RenderingContext<T>> {
  const f = fm<T>(mdFileContent, { allowUnsafe: false });
  f.attributes.rpm = rpm(f.body);
  f.attributes.tags = f.attributes.tags.map((val) => val.toLowerCase());
  f.attributes.writeUp = toHtml(f.body);

  if (typeof f.attributes.publishedDate == "string") {
    f.attributes.publishedDate = new Date(f.attributes.publishedDate);
  }

  return {
    getContext: async () => f.attributes,
  };
}

function toHtml(md: string): string {
  return mdIt()
    .use(markdownItAttrs, {
      leftDelimiter: "{",
      rightDelimiter: "}",
      allowedAttributes: [],
    })
    .render(md);
}

function rpm(md: string): number {
  return Math.ceil(md.split(" ").length / RPM_CONST);
}
