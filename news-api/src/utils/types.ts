export interface Source {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
}

export type SourceData = {
  sources: Source[];
  status: string;
};

export type Options = Record<string, string>;

export interface Article {
  source: {
    id: Nullable<string>;
    name: string;
  };
  author: Nullable<string>;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

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
  draw: DrawFunction<Article[]>;
}

export interface ISources {
  draw: DrawFunction<Source[]>;
  drawCategories(): void;
}
export interface IAppView {
  news: INews;
  sources: ISources;
  lastWindowWidth: number;
  drawNews: DrawFunction<NewsList>;
  drawSources: DrawFunction<SourceData>;
  burgerInteraction(): void;
}

export interface IController {
  getSources(callback: DrawFunction<SourceData>, cat?: string): void;
  getNews(e: Event, callback: DrawFunction<NewsList>): void;
}
export interface AppInterface {
  controller: IController;
  view: IAppView;
  start(): void;
}
