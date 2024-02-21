export function isType<T>(element: T | null, type: { new (): T }): element is T {
  return element instanceof type;
}

export function isUndefined<T>(value: T | undefined): value is undefined {
  return typeof value === 'undefined';
}

export function isNull<T>(value: T | null): value is null {
  return value === 'null';
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
