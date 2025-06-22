import { Configable, Configuration } from "./parser/config";
import { Thumbnail } from "./render/thumbnail";

export interface Prior {
  conf(): Configable<Configuration>;
  main(): Promise<LastStep>;
}

export interface LastStep {
  done(conf: Configable<Configuration>): Promise<void>;
}

export interface PageSetup<T> extends Thumbnail {
  ctx: T;
}

export interface PageSetupIndex<T> extends PageSetup<T> {
  renderRss(): Promise<void>;
}
