import { ILoader, Options, NewsList, DrawFunction } from '../../types/types';

class Loader implements ILoader {
  baseLink: string;
  options: Options;

  constructor(baseLink: string, options: Options) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResp(
    { endpoint, options = {} }: { endpoint: string; options?: Options },
    callback = () => {
      console.error('No callback for GET response');
    }
  ): void {
    console.log('endpoint= ', endpoint);
    this.load('GET', endpoint, callback, options);
  }

  private errorHandler(res: Response): Response {
    console.log('res=', res);
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  private makeUrl(options: Options, endpoint: string): string {
    const urlOptions: Options = { ...this.options, ...options };
    // console.log('thisoptions=', this.options);
    // console.log('options=', options);
    // console.log('urlOptions=', urlOptions);
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load(method: string, endpoint: string, callback: DrawFunction, options: Options = {}): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res: Response) => res.json())
      .then((data: NewsList) => callback(data))
      .catch((err: Error) => console.error(err));
  }
}

export default Loader;
