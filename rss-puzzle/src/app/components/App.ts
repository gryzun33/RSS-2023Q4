import BaseComponent from './BaseComponent';
import LoginPage from './LoginPage/LoginPage';
import StartPage from './StartPage';
import MainPage from './MainPage';

export default class App {
  private root: HTMLElement;
  public loginPage?: BaseComponent;
  public mainPage?: BaseComponent;
  public startPage?: BaseComponent;
  // public loginPage = new LoginPage();

  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add('wrapper');
    document.body.append(this.root);
    // this.start();
  }

  public start(): void {
    this.loginPage = new LoginPage(this.loadStartPage);
    this.root.append(this.loginPage.getElement());
    // this.startPage = new StartPage();
    // this.root.append(this.startPage.getElement());
  }

  public loadStartPage = (): void => {
    console.log('startpage');
    if (this.loginPage) {
      this.loginPage.destroy();
    }
    this.startPage = new StartPage(this.loadMainPage);
    this.root.append(this.startPage.getElement());
  };

  public loadMainPage = (): void => {
    console.log('mainpage');
    if (this.startPage) {
      this.startPage.destroy();
    }
    this.mainPage = new MainPage();
    this.root.append(this.mainPage.getElement());
  };
}
