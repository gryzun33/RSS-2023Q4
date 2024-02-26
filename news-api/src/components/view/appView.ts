import News from './news/news';
import Sources from './sources/sources';
import { NewsList, SourceData, Article, Source, IAppView, INews, ISources, Nullable } from '../../types/types';
export class AppView implements IAppView {
  public news: INews;
  public sources: ISources;
  public lastWindowWidth: number;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
    // this.categories = new Categories();
    this.lastWindowWidth = window.innerWidth;
    this.burgerInteraction();
  }

  public drawNews(data: NewsList): void {
    const plug: HTMLElement | null = document.querySelector('.plug-text');
    if (!plug) {
      throw new Error('plug is null');
    }
    plug.classList.add('hidden');
    const values: Article[] = data?.articles ? data?.articles : [];

    this.news.draw(values);
  }

  public drawSources(data: SourceData): void {
    const values: Source[] = data?.sources ? data?.sources : [];
    // this.sources.drawCategories();
    this.sources.draw(values);
  }

  public burgerInteraction(): void {
    const sourcesBox: HTMLElement | null = document.querySelector('.sources-box');
    if (!sourcesBox) {
      throw new Error('sources are null');
    }
    const sourcesElem: HTMLElement | null = document.querySelector('.sources');
    if (!sourcesElem) {
      throw new Error('sources are null');
    }
    const sourceTitle: Nullable<HTMLElement> = document.querySelector('.source-title');
    if (!sourceTitle) {
      throw new Error('sourceTitle is null');
    }
    sourcesElem.addEventListener('click', (e) => {
      const target: EventTarget | null = e.target;
      if (!target) {
        throw new Error('source is null');
      }
      if (target instanceof HTMLElement) {
        sourceTitle.innerText = target.innerText;
      }

      if (window.innerWidth <= 900) {
        toggleMenu();
      }
    });
    const burger: HTMLElement | null = document.querySelector('.burger');
    if (!burger) {
      throw new Error('sources are null');
    }
    burger.addEventListener('click', toggleMenu);

    window.addEventListener('resize', () => {
      const newWindowWidth = window.innerWidth;
      if (this.lastWindowWidth <= 900 && newWindowWidth > 900) {
        burger.classList.remove('burger-rotate');
        sourcesBox.classList.remove('sources-show');
        document.body.classList.remove('block-scroll');
      }
      this.lastWindowWidth = newWindowWidth;
    });

    function toggleMenu(): void {
      burger?.classList.toggle('burger-rotate');
      sourcesBox?.classList.toggle('sources-show');
      document.body.classList.toggle('block-scroll');
    }
  }
}

export default AppView;
