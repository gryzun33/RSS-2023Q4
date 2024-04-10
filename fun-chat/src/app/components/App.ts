import BaseComponent from './View/BaseComponent';
// import View from './View';
import Router from './Router';
import Model from './Model';
import Controller from './Controller';
import LoginPage from './View/LoginPage';
import MainPage from './View/MainPage';
import AboutPage from './View/AboutPage';

export default class App {
  protected root = new BaseComponent({ tag: 'div', classNames: ['wrapper'] });
  private router: Router;
  private currPage?: BaseComponent;

  // private routerMap: Map = new Map([
  //   ['/login', new LoginPage()],
  //   ['/main', new MainPage()],
  //   ['/about', new AboutPage()],
  // ]);
  // private model: Model;

  // private view: View;

  constructor() {
    // const view = new View();
    const model = new Model();
    console.log(model);
    const controller = new Controller();
    console.log(controller);
    const routes = this.createRoutes();
    this.router = new Router(routes);
  }

  start() {
    document.body.append(this.root.element);
    this.router.init();
  }

  createRoutes() {
    return [
      {
        path: ``,
        callback: () => this.setContent(new LoginPage()),
      },
      {
        path: `login`,
        callback: () => this.setContent(new LoginPage()),
      },
      {
        path: `main`,
        callback: () => this.setContent(new MainPage()),
      },
      {
        path: `about`,
        callback: () => this.setContent(new AboutPage()),
      },
    ];
  }
  setContent(newPage: BaseComponent) {
    if (this.currPage) {
      this.currPage.destroy();
    }
    this.currPage = newPage;
    this.root.append(newPage);
  }
}
