export default class App {
  private root: HTMLElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.textContent = 'hello';
  }

  public start() {
    document.body.append(this.root);
  }
}
