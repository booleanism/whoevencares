import { PathLike } from "fs";
import { Config_t, IParser, Markdown_t } from "../types/config.js";

export class Parser<T extends Config_t | Markdown_t> implements IParser<T> {
  path: PathLike;
  constructor(path: PathLike) {
    this.path = path;
  }

  parse(): T | undefined {
    return;
  }
}
