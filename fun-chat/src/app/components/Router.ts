import { Route } from '../utils/types';

export default class Router {
  private routes: Route[];
  // private currentRoute: Route | null = null;

  constructor(routes: Route[]) {
    this.routes = routes;
    window.addEventListener('popstate', () => this.handleRouteChange());
  }

  public init() {
    // this.loadInitialRoute();
    this.navigate(this.routes[0].path);
  }

  private navigate = (url: string) => {
    // if (typeof url === 'string') {
    //   this.setHistory(url);
    // }
    // const urlString = window.location[this.params.locationField].slice(1);

    const route = this.routes.find((elem) => elem.path === url);

    if (!route) {
      throw new Error('route is undefined');
    }
    route.callback();
  };

  protected handleRouteChange() {
    const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/'));
    const route = this.routes.find((route) => route.path === path);
    if (route) {
      console.log('Route found:', route);
    } else {
      console.error('Route not found for path:', path);
    }
  }
}
