import { Config_t } from "../types/config.js";
import { PathLike, readFileSync } from "fs";

export class Config<T extends Config_t> {
  path: PathLike;
  constructor(path: PathLike) {
    this.path = path;
  }

  async parse(): Promise<T> {
    return JSON.parse(readFileSync(this.path, { encoding: "utf-8" })) as T;
  }
}
