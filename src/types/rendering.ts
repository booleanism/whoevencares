import { Environment } from "nunjucks";

export interface Rendering {
  render<T extends Environment>(template: T): void;
}
