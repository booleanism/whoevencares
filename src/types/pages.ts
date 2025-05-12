export interface IIndex {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contents: IContent[];
}

export interface IContent {
  title: string;
  author: string;
  publishedDate: Date;
  url: string;
  description: string;
  ilust?: string;
  writeUp: string;
  draft: boolean;
}
