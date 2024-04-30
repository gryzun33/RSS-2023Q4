import { Route, Navigation } from '../utils/types';
import emitter from './EventEmitter';
import storage from './Storage';
import { EVENT } from '../utils/constants';

export default class Router {
  private routes: Route[];
  constructor(routes: Route[]) {
    this.routes = routes;
    emitter.on(EVENT.navigate, this.navigate);
    window.addEventListener('popstate', this.handleRouteChange);
  }

  public init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      let path = window.location.pathname.slice(1);
      const user = storage.getData('user');
      if (user) {
        return;
      }
      if (path === Navigation.MAIN) {
        path = Navigation.LOGIN;
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

    if (path === Navigation.BACK_FROM_ABOUT) {
      path = isUser ? Navigation.MAIN : Navigation.LOGIN;
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
