import { Route } from '../utils/types';
import emitter from './EventEmitter';

export default class Router {
  private routes: Route[];
  constructor(routes: Route[]) {
    this.routes = routes;
    emitter.on('navigate', this.navigate);
    window.addEventListener('popstate', this.handleRouteChange);
  }

  public init() {
    document.addEventListener('DOMContentLoaded', () => {
      const path = window.location.pathname.slice(1);
      this.navigate(path);
    });
  }

  private navigate = (url: unknown) => {
    if (typeof url !== 'string') {
      throw new Error('url isn`t string');
    }
    if (url.length > 0) {
      window.history.pushState(null, '', `/${url}`);
      // console.log('historylength=', window.history.length);
    }

    const route = this.routes.find((elem) => elem.path === url);
    // console.log('route=', route);

    if (!route) {
      this.navigate(this.routes[0].path);
    } else {
      route.callback();
    }
  };

  protected handleRouteChange = () => {
    // console.log('popstate');
    const path = window.location.pathname.slice(1);
    console.log('path2=', path);
    this.navigate(path);
  };
}
