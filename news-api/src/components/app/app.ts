import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { SourceData, NewsList, AppInterface, IController, IAppView } from '../../types/types';
import { isNull, isType } from '../../types/predicats';

class App implements AppInterface {
  public controller: IController;
  public view: IAppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start() {
    this.view.sources.drawCategories();
    const sourcesElem: HTMLElement | null = document.querySelector('.sources');
    if (isNull(sourcesElem)) {
      throw new Error('sources are null');
    }

    sourcesElem.addEventListener('click', (e) =>
      this.controller.getNews(e, (data: NewsList): void => this.view.drawNews(data))
    );

    this.controller.getSources((data: SourceData): void => this.view.drawSources(data));

    const categoriesList: HTMLFormElement | null = document.querySelector('.categories-list');
    if (isNull(categoriesList)) {
      throw new Error('sources are null');
    }
    categoriesList.addEventListener('change', (e) => {
      const target = e.target;
      if (isNull(target) || !isType(target, HTMLInputElement)) {
        throw new Error(`element is null or isn't HTMLInputElement`);
      }

      if (target instanceof HTMLInputElement) {
        target.closest('.cat-input');
        this.controller.getSources((data: SourceData): void => this.view.drawSources(data), target.value);
      }
    });
  }
}

export default App;
