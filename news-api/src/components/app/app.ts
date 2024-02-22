import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { SourceData, NewsList, isNull, AppInterface, IController, IAppView } from '../../types/types';

class App implements AppInterface {
  public controller: IController;
  public view: IAppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start() {
    const sourcesElem: HTMLElement | null = document.querySelector('.sources');
    if (isNull(sourcesElem)) {
      throw new Error('sources are null');
    }
    sourcesElem.addEventListener('click', (e) =>
      this.controller.getNews(e, (data: NewsList) => this.view.drawNews(data))
    );

    this.controller.getSources((data: SourceData) => this.view.drawSources(data));
  }
}

export default App;
