import styles from './app.module.scss';
import Button from '../Button';
import BaseComponent from '../BaseComponent';
// import BaseComponent from '../BaseComponent';

export default class App {
  protected root = new BaseComponent({ tag: 'div', classNames: [styles.wrapper] });
  protected garageBtn = new Button({
    classNames: ['garage-btn'],
    text: 'to Garage',
  });

  protected winnersBtn = new Button({
    classNames: ['winners-btn'],
    text: 'to Winners',
  });

  constructor() {
    // this.root = document.createElement('div') as HTMLElement;
    // this.root.classList.add(styles.wrapper);
    // this.createView();
  }

  public start(): void {
    // console.log('hello');
    // this.root.innerText = 'HEllO';
    this.createView();
  }

  protected createView(): void {
    const btnBox = new BaseComponent({ tag: 'div', classNames: ['btn-box'] });
    btnBox.append(this.garageBtn, this.winnersBtn);
    this.root.append(btnBox);
    document.body.append(this.root.getElement());
  }
}
