import { LastStep } from "../prior";

export interface Rendering extends LastStep {
  render(): Promise<string>[];
}

export interface PageRendering extends LastStep {
  render<T>(ctx: T[]): Promise<void>;
}
