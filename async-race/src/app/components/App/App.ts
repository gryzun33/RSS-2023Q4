import styles from './app.module.scss';

export default class App {
  protected root: HTMLElement;

  constructor() {
    this.root = document.createElement('div') as HTMLElement;
    this.root.classList.add(styles.wrapper);
    document.body.append(this.root);
  }

  public start(): void {
    console.log('hello');
  }
}
