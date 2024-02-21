import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { SourceData, isType, NewsList } from '../../types/types';

class App {
  controller: AppController;
  view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start() {
    const sourcesElem: HTMLElement | null = document.querySelector('.sources');
    if (!isType(sourcesElem, HTMLElement)) {
      throw new Error();
    } else {
      sourcesElem.addEventListener('click', (e) =>
        this.controller.getNews(e, (data: NewsList) => this.view.drawNews(data))
      );
    }

    this.controller.getSources((data: SourceData) => this.view.drawSources(data));
  }
}

export default App;
