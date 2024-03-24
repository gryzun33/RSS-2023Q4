import styles from './carview.module.scss';

import BaseComponent from '../BaseComponent';
import { CarData } from '../../utils/types';
import Button from '../Button';
import carIcon from '../../utils/icons';

export default class CarView extends BaseComponent {
  public selectBtn = new Button({ classNames: ['select-btn'], text: 'select' });
  public removeBtn = new Button({ classNames: ['remove-btn'], text: 'remove' });
  public startBtn = new Button({ classNames: ['start-btn'], text: 'start' });
  public stopBtn = new Button({ classNames: ['stop-btn'], text: 'stop' });
  public carImg = new BaseComponent({ tag: 'div', classNames: [styles.carImg] });

  constructor(data: CarData) {
    super({ tag: 'div', classNames: [styles.carBlock] });
    this.element.id = data.id.toString();
    this.createView(data);
  }

  protected createView(data: CarData) {
    console.log('carview', data);
    const carName = new BaseComponent({ tag: 'div', classNames: ['car-name'], text: data.name });
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons-box'] });
    const controls = new BaseComponent({ tag: 'div', classNames: ['controls-box'] });
    const flag = new BaseComponent({ tag: 'div', classNames: [styles.flagIcon] });

    this.carImg.html(carIcon(data.color));

    buttons.append(this.selectBtn, this.removeBtn);
    controls.append(this.startBtn, this.stopBtn);
    this.append(carName, buttons, controls, this.carImg, flag);
  }
}
