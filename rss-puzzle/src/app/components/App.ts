import BaseComponent from './BaseComponent';
import LoginPage from './LoginPage';
import StartPage from './StartPage';
import MainPage from './MainPage';
import { storage } from './Storage';
import appState from './AppState';

export default class App {
  protected root: HTMLElement;
  protected loginPage?: BaseComponent;
  protected mainPage?: BaseComponent;
  protected startPage?: BaseComponent;
  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add('wrapper');
    document.body.append(this.root);
  }

  public start(): void {
    if (this.getUserLogin()) {
      this.loadStartPage();
    } else {
      this.loadLoginPage();
    }
  }

  public loadLoginPage = (): void => {
    if (this.mainPage) {
      this.mainPage.destroy();
    }
    this.loginPage = new LoginPage(this.loadStartPage);
    this.root.append(this.loginPage.getElement());
  };

  public loadStartPage = (): void => {
    if (this.loginPage) {
      this.loginPage.destroy();
    }
    this.startPage = new StartPage(this.loadMainPage);
    this.root.append(this.startPage.getElement());
  };

  public loadMainPage = (): void => {
    if (this.startPage) {
      this.startPage.destroy();
    }
    this.mainPage = new MainPage(this.reloadLoginPage);
    this.root.append(this.mainPage.getElement());
  };

  protected getUserLogin(): string | null {
    return storage.getData('name');
  }

  public reloadLoginPage = () => {
    storage.removeStorage();
    this.loadLoginPage();
    appState.resetState();
  };
}
