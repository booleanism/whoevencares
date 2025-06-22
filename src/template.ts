import { Environment, FileSystemLoader } from "nunjucks";
import { Configable, Configuration } from "./parser/config";

export async function newTemplate(
  conf: Configable<Configuration>,
): Promise<Environment> {
  return new Environment(
    new FileSystemLoader((await conf.getConfig()).template.content),
    { autoescape: false },
  );
}
