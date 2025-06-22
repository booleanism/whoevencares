import sharp from "sharp";
import { Configuration } from "../parser/config";
import { Path, PathType } from "../path";

export interface Thumbnail {
  applyThumbnail(): Promise<void>;
}

export interface ThumbnailContext {
  author: string;
  title: string;
  publishedDate: Date;
  url: string;
  rpm: number | string;
}

export async function newThumbnail(
  templatePath: string,
  ctx: ThumbnailContext,
): Promise<sharp.Sharp> {
  return sharp(templatePath).composite([
    applyAuthor(ctx.author),
    applyRpm(ctx.rpm),
    applyDate(ctx.publishedDate),
    applyTitle(ctx.title),
    applyUrl(ctx.url),
  ]);
}

export function toJpgPath(path: string): string {
  return path.replaceAll(".html", ".jpg");
}

function applyAuthor(author: string): sharp.OverlayOptions {
  return {
    input: Buffer.from(`
            <svg width="200" height="30">
              <text x="0" y="15" fill="white" font-family="JetBrains Mono" font-size="20">
                ${author}
              </text>
            </svg>
          `),
    left: 120,
    top: 83,
  };
}

function applyRpm(rpm: number | string): sharp.OverlayOptions {
  return {
    input: Buffer.from(`
            <svg width="200" height="30">
              <text x="0" y="15" fill="white" font-family="JetBrains Mono New" font-size="20">
                ${rpm} minutes
              </text>
            </svg>
          `),
    left: 525,
    top: 83,
  };
}

function applyTitle(title: string): sharp.OverlayOptions {
  return {
    input: {
      text: {
        text: title,
        font: "Courier New",
        dpi: 300,
        width: 700,
        align: "centre",
      },
    },
  };
}

function applyDate(date: Date): sharp.OverlayOptions {
  return {
    input: Buffer.from(`
            <svg width="200" height="30">
              <text x="0" y="15" fill="white" font-family="Courier New" font-weight="bold" font-size="20">
                ${date.toDateString()}
              </text>
            </svg>
          `),
    left: 915,
    top: 83,
  };
}

function applyUrl(url: string): sharp.OverlayOptions {
  return {
    input: Buffer.from(`
            <svg width="970" height="30">
              <text x="0" y="15" fill="white" font-family="Courier New" font-weight="bold" font-size="13">
                ${url.replace("index.html", "")}
              </text>
            </svg>
          `),
    top: 518,
    left: 120,
  };
}

export function thumbImpl<T extends ThumbnailContext>(
  conf: Configuration,
  assetsDir: string,
  htmlFileName: string,
  ctx: T,
  cb: (assetsPath: string) => void,
): () => Promise<void> {
  const assetDir = new Path(conf.outDir).join(assetsDir).create(PathType.Dir);
  const jpgFileName = toJpgPath(htmlFileName);
  cb(`${assetsDir}${jpgFileName}`);
  return async () => {
    return new Promise(() => {
      newThumbnail(conf.template.thumbnail, ctx).then(async (sharp) => {
        const generatedThumbPath = await new Path(await assetDir)
          .join(jpgFileName)
          .create(PathType.File);
        sharp.toFile(generatedThumbPath);
      });
    });
  };
}
