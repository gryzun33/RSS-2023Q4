import News from './news/news';
import Sources from './sources/sources';
import { NewsList, SourceData, Article, Source, IAppView, INews, ISources } from '../../types/types';

export class AppView implements IAppView {
  public news: INews;
  public sources: ISources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: NewsList): void {
    console.log('data1=', data);
    const values: Article[] = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: SourceData): void {
    console.log('data2=', data);
    const values: Source[] = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
