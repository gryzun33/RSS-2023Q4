import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { AppInterface, Nullable } from '../../utils/types';
import { isNull } from '../../utils/predicats';

class App implements AppInterface {
  public controller = new AppController();
  public view = new AppView();

  public start() {
    this.view.sources.drawCategories();
    const sourcesElem: Nullable<HTMLElement> = document.querySelector('.sources');
    if (isNull(sourcesElem)) {
      throw new Error('sources are null');
    }

    sourcesElem.addEventListener('click', (e) => this.controller.getNews(e, this.view.drawNews));

    this.controller.getSources(this.view.drawSources);

    const categoriesList: Nullable<HTMLFormElement> = document.querySelector('.categories-list');
    if (isNull(categoriesList)) {
      throw new Error('sources are null');
    }
    categoriesList.addEventListener('change', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement) {
        target.closest('.cat-input');
        this.controller.getSources(this.view.drawSources, target.value);
      } else {
        throw new Error(`element isn't HTMLInputElement`);
      }
    });
  }
}

export default App;
