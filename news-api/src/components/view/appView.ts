import News from './news/news';
import Sources from './sources/sources';
import { NewsList, SourceData, Article, Source, IAppView, Nullable } from '../../utils/types';
import { CONTROL_WIDTH } from '../../utils/constants';

enum BurgerSelectors {
  Burger = '.burger',
  Rotate = 'burger-rotate',
}

enum SourcesSelectors {
  SourcesElem = '.sources',
  SourcesBox = '.sources-box',
  Title = '.source-title',
  Item = '.source__item',
  SourcesShow = 'sources-show',
}

enum AddSelectors {
  Plug = '.plug-text',
  Hidden = 'hidden',
  BlockScroll = 'block-scroll',
}

export class AppView implements IAppView {
  public news = new News();
  public sources = new Sources();
  public lastWindowWidth: number = window.innerWidth;

  constructor() {
    this.burgerInteraction();
  }

  public drawNews = (data: NewsList): void => {
    const plug: Nullable<HTMLElement> = document.querySelector(AddSelectors.Plug);
    if (!plug) {
      throw new Error('plug is null');
    }
    plug.classList.add(AddSelectors.Hidden);
    const values: Article[] = data?.articles ?? [];

    this.news.draw(values);
  };

  public drawSources = (data: SourceData): void => {
    const values: Source[] = data?.sources ?? [];
    this.sources.draw(values);
  };

  public burgerInteraction(): void {
    const sourcesBox: Nullable<HTMLElement> = document.querySelector(SourcesSelectors.SourcesBox);
    if (!sourcesBox) {
      throw new Error('sources are null');
    }
    const sourcesElem: Nullable<HTMLElement> = document.querySelector(SourcesSelectors.SourcesElem);
    if (!sourcesElem) {
      throw new Error('sources are null');
    }
    const sourceTitle: Nullable<HTMLElement> = document.querySelector(SourcesSelectors.Title);
    if (!sourceTitle) {
      throw new Error('sourceTitle is null');
    }
    sourcesElem.addEventListener('click', (e) => {
      const target: Nullable<EventTarget> = e.target;
      if (!target) {
        throw new Error('source is null');
      }
      if (target instanceof HTMLElement) {
        const sourceItem: Nullable<HTMLElement> = target.closest(SourcesSelectors.Item);
        if (!sourceItem) {
          return;
        }
        sourceTitle.innerText = sourceItem.innerText;
      }

      if (window.innerWidth <= CONTROL_WIDTH) {
        toggleMenu();
      }
    });
    const burger: Nullable<HTMLElement> = document.querySelector(BurgerSelectors.Burger);
    if (!burger) {
      throw new Error('sources are null');
    }
    burger.addEventListener('click', toggleMenu);

    window.addEventListener('resize', () => {
      const newWindowWidth = window.innerWidth;
      if (this.lastWindowWidth <= CONTROL_WIDTH && newWindowWidth > CONTROL_WIDTH) {
        burger.classList.remove(BurgerSelectors.Rotate);
        sourcesBox.classList.remove(SourcesSelectors.SourcesShow);
        document.body.classList.remove(AddSelectors.BlockScroll);
      }
      this.lastWindowWidth = newWindowWidth;
    });

    function toggleMenu(): void {
      burger?.classList.toggle(BurgerSelectors.Rotate);
      sourcesBox?.classList.toggle(SourcesSelectors.SourcesShow);
      document.body.classList.toggle(AddSelectors.BlockScroll);
    }
  }
}

export default AppView;
