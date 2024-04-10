import { Route } from '../utils/types';
import emitter from './EventEmitter';

export default class Router {
  private routes: Route[];
  // private currentRoute: Route | null = null;

  constructor(routes: Route[]) {
    this.routes = routes;

    emitter.on('navigate', this.navigate);

    window.addEventListener('popstate', this.handleRouteChange);
  }

  public init() {
    document.addEventListener('DOMContentLoaded', () => {
      const path = window.location.pathname.slice(1);
      console.log('path1=', path);
      this.navigate(path);
    });
    // this.loadInitialRoute();
    // this.navigate(this.routes[0].path);
  }

  private navigate = (url: unknown) => {
    if (typeof url !== 'string') {
      throw new Error('url isn`t string');
    }
    if (url.length > 0) {
      console.log('url2=', url);
      window.history.pushState(null, '', `/${url}`);
      console.log('history length=', window.history.length);
      console.log('history state=', window.history.state);
    }
    // console.log('url=', url);

    const route = this.routes.find((elem) => elem.path === url);
    console.log('route=', route);

    if (!route) {
      this.navigate(this.routes[0].path);
    } else {
      route.callback();
    }
  };

  protected handleRouteChange = () => {
    console.log('popstate');
    const path = window.location.pathname.slice(1);
    this.navigate(path);
  };
}
