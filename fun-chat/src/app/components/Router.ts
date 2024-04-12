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

  public init() {
    document.addEventListener('DOMContentLoaded', () => {
      let path = window.location.pathname.slice(1);
      const isUser = storage.getData('user');
      if (path === 'main' && !isUser) {
        path = 'login';
      } else if (path === 'login' && isUser) {
        path = 'main';
      }
      // console.log('pathhhhh=', path);
      this.navigate(path);
    });
  }

  private navigate = (url: unknown) => {
    if (typeof url !== 'string') {
      throw new Error('url isn`t string');
    }

    let path: string = url;
    if (path === 'back') {
      const isUser = storage.getData('user');
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

  protected handleRouteChange = () => {
    console.log('popstate');
    const path = window.location.pathname.slice(1);
    // console.log('path2=', path);
    this.navigate(path);
  };
}
