export function isType<T>(element: T | null, type: { new (): T }): element is T {
  return element instanceof type;
}

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
  [key: string]: string | Options;
};

export type NewsList = {
  status: string;
  totalResults: number;
  articles: Article[];
};

export type DrawFunction = (value: SourceData | NewsList) => void;

export interface ILoader {
  baseLink: string;
  options: Options;
}
