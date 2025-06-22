export interface RenderingContext<T> {
  getContext(): Promise<T>;
}
