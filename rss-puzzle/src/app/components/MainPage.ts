import BaseComponent from './BaseComponent';
import Button from './Button';
import { СallbackFunc } from '../utils/types';

export default class MainPage extends BaseComponent {
  public logOutBtn?: BaseComponent<HTMLButtonElement>;
  constructor(public reloadLoginPage: СallbackFunc) {
    super({ tag: 'div', classNames: ['main-page'] });
    this.createView();
  }

  protected createView() {
    this.logOutBtn = new Button({
      classNames: ['logout-btn'],
      text: 'Logout',
      callback: this.reloadLoginPage,
    });
    this.append(this.logOutBtn);
  }
}
