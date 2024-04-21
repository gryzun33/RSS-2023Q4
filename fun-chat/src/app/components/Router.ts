import { Route } from '../utils/types';
import emitter from './EventEmitter';
import storage from './Storage';

export default class Router {
  private routes: Route[];
  constructor(routes: Route[]) {
    this.routes = routes;
    emitter.on('navigate', this.navigate);
    window.addEventListener('popstate', this.handleRouteChange);
  }

  public init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      let path = window.location.pathname.slice(1);
      const user = storage.getData('user');
      if (user) {
        return;
      }
      if (path === 'main') {
        path = 'login';
      }
      this.navigate(path);
    });
  }

  private navigate = (url: unknown): void => {
    if (typeof url !== 'string') {
      throw new Error('url isn`t string');
    }

    let path: string = url;
    const isUser = storage.getData('user');

    if (path === 'back') {
      path = isUser ? 'main' : 'login';
    }

    if (path.length > 0) {
      window.history.pushState(null, '', `/${path}`);
    }

    const route = this.routes.find((elem) => elem.path === path);

    if (!route) {
      this.navigate(this.routes[0].path);
    } else {
      route.callback();
    }
  };

  protected handleRouteChange = (): void => {
    const path = window.location.pathname.slice(1);
    this.navigate(path);
  };
}
