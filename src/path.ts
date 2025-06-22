import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

export enum PathType {
  File,
  Dir,
}

export class Path {
  private basePath: string;
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  join(p: string): Path {
    return new Path(path.join(this.basePath, p));
  }

  async create(type: PathType): Promise<string> {
    try {
      await stat(this.basePath);
    } catch {
      if (type === PathType.File) {
        await writeFile(this.basePath, []);
        return this.basePath;
      }
      await mkdir(this.basePath, { recursive: true });
    }
    return this.basePath;
  }

  toString(): string {
    return this.basePath;
  }
}
