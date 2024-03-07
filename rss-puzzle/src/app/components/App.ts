import LoginPage from './LoginPage/LoginPage.ts';

export default class App {
  private root: HTMLElement;

  public loginPage = new LoginPage();

  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add('wrapper');
  }

  public start(): void {
    document.body.append(this.root);
    this.root.append(this.loginPage.getElement());
  }
}
