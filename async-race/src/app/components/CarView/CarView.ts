import styles from './carview.module.scss';
import BaseComponent from '../utilsComponents/BaseComponent';
import { CarData } from '../../utils/types';
import Button from '../utilsComponents/Button';
import carIcon from '../../utils/icons';
import { deleteCar, startCar, stopCar } from '../api';
import getDistance from '../../utils/helpers';
import emitter from '../EventEmitter';
import state from '../State';
import isCarData from '../../utils/predicates';

export default class CarView extends BaseComponent {
  public fetchController = new AbortController();
  protected animationId?: number;
  public selectBtn = new Button({ classNames: [styles.selectBtn], text: 'Select' });
  public removeBtn = new Button({ classNames: [styles.removeBtn], text: 'Remove' });
  public startBtn = new Button({ classNames: [styles.startBtn], text: 'А' });
  public stopBtn = new Button({ classNames: [styles.stopBtn], text: 'В', disabled: true });
  public carImg = new BaseComponent({ tag: 'div', classNames: [styles.carImg] });

  public carName = new BaseComponent({ tag: 'div', classNames: [styles.carName] });

  public id: number = 0;

  constructor(
    data: CarData,
    public raceBtn: Button
  ) {
    super({ tag: 'div', classNames: [styles.carBlock] });
    this.id = data.id;
    this.element.id = data.id.toString();
    this.createView(data);
    this.removeBtn.on('click', this.clickOnRemoveBtn);
    this.startBtn.on('click', this.clickOnStartBtn);
    this.stopBtn.on('click', this.clickOnStopBtn);
    this.selectBtn.on('click', this.clickOnSelectBtn);
    emitter.on('startMoving', this.startMoving);
    emitter.on('stopMoving', this.stopMoving);
    emitter.on('updateCar', this.updateCarView);
    emitter.on('toStart', this.moveCarToStart);
  }
  protected createView(data: CarData) {
    this.carName.setTextContent(data.name);
    const buttons = new BaseComponent({ tag: 'div', classNames: [styles.buttonsBox] });
    const controls = new BaseComponent({ tag: 'div', classNames: [styles.controlsBox] });
    const flag = new BaseComponent({ tag: 'div', classNames: [styles.flagIcon] });
    this.carImg.html(carIcon(data.color));
    buttons.append(this.selectBtn, this.removeBtn);
    controls.append(this.startBtn, this.stopBtn);
    this.append(this.carName, buttons, controls, this.carImg, flag);
  }

  protected clickOnRemoveBtn = () => {
    deleteCar(this.id);
  };

  public clickOnStartBtn = () => {
    this.fetchController = new AbortController();
    startCar(this.id, 'started', this.fetchController);
    this.startBtn.disable();
    if (!state.race) {
      this.raceBtn.disable();
    } else {
      // car.stopBtn.disable();
      this.selectBtn.disable();
      this.removeBtn.disable();
    }
  };

  public clickOnStopBtn = () => {
    const status = state.getCarStatus(this.id);
    if (status === 'drive' || status === 'broken') {
      stopCar(this.id, this.fetchController);
      this.carImg.removeClass(styles.carBroken);
    }

    this.stopBtn.disable();
    if (!state.race) {
      this.raceBtn.enable();
    }
    this.selectBtn.enable();
    this.removeBtn.enable();
  };

  protected moveCarToStart = (id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not number');
    }
    if (this.id !== id) {
      return;
    }
    this.stopMoving(this.id);
    this.carImg.css('transform', `translateX(0px)`);
    this.startBtn.enable();
  };

  protected clickOnSelectBtn = () => {
    emitter.emit('enableUpdateForm', this.id);
  };

  protected updateCarView = (car: unknown) => {
    if (!isCarData(car)) {
      throw new Error('argument is not type CarData');
    }
    if (this.element.id !== String(car.id)) {
      return;
    }

    this.carName.setTextContent(car.name);
    this.carImg.html(carIcon(car.color));
  };

  public startMoving = (duration: unknown, id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not number');
    }

    if (this.id !== id) {
      return;
    }
    if (typeof duration !== 'number') {
      throw new Error('duration is not number');
    }
    if (!state.race) {
      this.stopBtn.enable();
    }

    const distance = getDistance(this.carImg.element);
    const speed = distance / duration;
    const startX = 0;
    let startTime: number = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const newX = startX + speed * progress;
      this.carImg.css('transform', `translateX(${newX}px)`);

      if (progress < duration) {
        this.animationId = requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  public stopMoving = (id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not number');
    }

    if (this.id !== id) {
      return;
    }

    if (!this.animationId) {
      throw new Error('animationid is undefined');
    }
    const status = state.getCarStatus(this.id);
    if (status === 'broken') {
      this.carImg.addClass(styles.carBroken);
    }

    cancelAnimationFrame(this.animationId);
  };
}
