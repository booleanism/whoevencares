import { Config_t } from "../types/config.js";
import { Environment, FileSystemLoader } from "nunjucks";

export class Template extends Environment {
  conf: Config_t;
  constructor(conf: Config_t) {
    super(new FileSystemLoader(conf.templateDir), { autoescape: false });
    this.conf = conf;
  }
}
