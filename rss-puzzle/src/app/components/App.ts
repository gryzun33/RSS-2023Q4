import BaseComponent from './BaseComponent';
import LoginPage from './LoginPage';
import StartPage from './StartPage';
import MainPage from './MainPage';
import { storage } from './Storage';
import appState from './AppState';
import { СallbackFunc, PageName } from '../utils/types';

export default class App {
  protected root: HTMLElement;
  protected currPage?: BaseComponent;
  private pageMap: Map<string, new (arg: СallbackFunc) => BaseComponent> = new Map();

  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add('wrapper');
    document.body.append(this.root);
    this.pageMap.set(PageName.START, StartPage);
    this.pageMap.set(PageName.LOGIN, LoginPage);
    this.pageMap.set(PageName.MAIN, MainPage);
  }

  public loadPage = (page?: string) => {
    if (!page) {
      return;
    }

    if (!this.pageMap.has(page)) {
      throw new Error(`page with name <${page}> doesn't exist`);
    }

    if (this.currPage) {
      this.currPage.destroy();
    }

    const PageClass = this.pageMap.get(page)!;
    this.currPage = new PageClass(this.loadPageCallback(page));
    this.root.append(this.currPage.getElement());
  };

  public start(): void {
    if (this.getUserLogin()) {
      this.loadPage(PageName.START);
    } else {
      this.loadPage(PageName.LOGIN);
    }
  }

  private loadPageCallback = (name: string): СallbackFunc =>
    name === PageName.MAIN ? this.reloadLoginPage : this.loadPage;

  protected getUserLogin(): string | null {
    return storage.getData('name');
  }

  public reloadLoginPage = () => {
    storage.removeStorage();
    this.loadPage(PageName.LOGIN);
    appState.resetState();
  };
}
