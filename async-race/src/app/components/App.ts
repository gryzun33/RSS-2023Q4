export default class App {
  protected root: HTMLElement;

  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add('wrapper');
    document.body.append(this.root);
  }

  public start(): void {
    console.log('hello');
  }
}
