import BaseComponent from './View/BaseComponent';
import Router from './Router';
import Controller from './Controller';
import LoginPage from './View/LoginPage';
import MainPage from './View/MainPage';
import AboutPage from './View/AboutPage';
import ModalServer from './View/ModalServer';
import emitter from './EventEmitter';
import { Route, Navigation } from '../utils/types';
import { EVENT } from '../utils/constants';

export default class App {
  protected page: string = '';
  protected root = new BaseComponent({ tag: 'div', classNames: ['wrapper'] });
  protected router: Router;
  protected currPage?: BaseComponent;
  protected modal?: ModalServer;
  protected controller = new Controller();
  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    emitter.on(EVENT.disconnect, this.openModal);
    emitter.on(EVENT.connect, this.closeModal);
  }

  public start(): void {
    document.body.append(this.root.element);
    this.router.init();
  }

  protected openModal = (): void => {
    this.modal = new ModalServer(`Connecting to the server`);
    this.root.append(this.modal);
  };

  protected closeModal = (): void => {
    this.modal?.close();
  };
  protected createRoutes(): Route[] {
    return [
      {
        path: Navigation.LOGIN,
        callback: () => this.setContent(new LoginPage(), Navigation.LOGIN),
      },
      {
        path: Navigation.MAIN,
        callback: () => this.setContent(new MainPage(), Navigation.MAIN),
      },
      {
        path: Navigation.ABOUT,
        callback: () => this.setContent(new AboutPage(), Navigation.ABOUT),
      },
    ];
  }
  setContent(newPage: BaseComponent, page: string): void {
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
