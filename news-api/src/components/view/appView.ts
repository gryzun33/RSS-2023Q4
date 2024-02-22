import News from './news/news';
import Sources from './sources/sources';
import { NewsList, SourceData, Article, Source } from '../../types/types';

export class AppView {
  news: News;
  sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  drawNews(data: NewsList) {
    console.log('data1=', data);
    const values: Article[] = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  drawSources(data: SourceData) {
    console.log('data2=', data);
    const values: Source[] = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
