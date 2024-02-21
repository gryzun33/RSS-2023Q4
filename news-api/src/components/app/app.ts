import AppController from '../controller/controller';
import { AppView } from '../view/appView';

type Source = {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
};

type SourceData = {
  sources: Source[];
  status: string;
};

type Options = {
  [key: string]: string;
};

type Article = {
  [key: string]: string | Options;
};

type NewsList = {
  status: string;
  totalResults: number;
  articles: Article[];
};

// type DrawFunction = (value: SourceData | NewsList) => void;

class App {
  controller: AppController;
  view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start() {
    const sourcesElem = document.querySelector('.sources') as HTMLElement;
    sourcesElem.addEventListener('click', (e) =>
      this.controller.getNews(e, (data: NewsList) => this.view.drawNews(data))
    );
    this.controller.getSources((data: SourceData) => this.view.drawSources(data));
  }
}

export default App;
