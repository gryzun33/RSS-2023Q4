export type Source = {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
};

export type SourceData = {
  sources: Source[];
  status: string;
};

export type Options = Record<string, string>;

export type Article = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

export type NewsList = {
  status: string;
  totalResults: number;
  articles: Article[];
};

export type DrawFunction<T> = (value: T) => void;

export interface ILoader {
  baseLink: string;
  options: Options;
}

export type Nullable<T> = T | null;

export interface INews {
  draw(data: Article[]): void;
}

export interface ISources {
  draw(data: Source[]): void;
}
export interface IAppView {
  news: INews;
  sources: ISources;
  drawNews(data: NewsList): void;
  drawSources(data: SourceData): void;
}

export interface IController {
  getSources(callback: DrawFunction<SourceData>): void;
  getNews(e: Event, callback: DrawFunction<NewsList>): void;
}
export interface AppInterface {
  controller: IController;
  view: IAppView;
  start(): void;
}
