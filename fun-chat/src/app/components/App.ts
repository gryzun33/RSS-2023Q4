import BaseComponent from './View/BaseComponent';
// import View from './View';
import Router from './Router';
// import State from './State';
import Controller from './Controller';
import LoginPage from './View/LoginPage';
import MainPage from './View/MainPage';
import AboutPage from './View/AboutPage';
import ModalServer from './View/ModalServer';
import emitter from './EventEmitter';

export default class App {
  protected page: string = '';
  protected root = new BaseComponent({ tag: 'div', classNames: ['wrapper'] });
  private router: Router;
  private currPage?: BaseComponent;
  protected modal?: ModalServer;

  // private routerMap: Map = new Map([
  //   ['/login', new LoginPage()],
  //   ['/main', new MainPage()],
  //   ['/about', new AboutPage()],
  // ]);
  // private model: Model;

  // private view: View;
  protected controller = new Controller();
  constructor() {
    // console.log(controller);
    const routes = this.createRoutes();
    this.router = new Router(routes);
    // console.log(this.router);
    emitter.on('disconnect', this.openModal);
    emitter.on('connect', this.closeModal);
  }

  start() {
    document.body.append(this.root.element);
    this.router.init();
  }

  openModal = () => {
    this.modal = new ModalServer(`Connecting to the server`);
    this.root.append(this.modal);
  };

  closeModal = () => {
    this.modal?.close();
  };
  createRoutes() {
    return [
      // {
      //   path: ``,
      //   callback: () => this.setContent(new LoginPage()),
      // },
      {
        path: `login`,
        callback: () => this.setContent(new LoginPage(), 'login'),
      },
      {
        path: `main`,
        callback: () => this.setContent(new MainPage(), 'main'),
      },
      {
        path: `about`,
        callback: () => this.setContent(new AboutPage(), 'about'),
      },
    ];
  }
  setContent(newPage: BaseComponent, page: string) {
    if (this.currPage) {
      this.currPage.destroy();
    }
    this.currPage = newPage;
    this.root.append(newPage);
    if (this.page === 'about' && page === 'main') {
      this.controller.externalUsersRequest();
    }
    this.page = page;
  }
}
