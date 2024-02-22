import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { SourceData, NewsList, isNull } from '../../types/types';

class App {
  controller: AppController;
  view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start() {
    const sourcesElem: HTMLElement | null = document.querySelector('.sources');
    if (isNull<HTMLElement>(sourcesElem)) {
      throw new Error();
    }
    sourcesElem.addEventListener('click', (e) =>
      this.controller.getNews(e, (data: NewsList | SourceData) => this.view.drawNews(data))
    );

    this.controller.getSources((data: NewsList | SourceData) => this.view.drawSources(data));
  }
}

export default App;
