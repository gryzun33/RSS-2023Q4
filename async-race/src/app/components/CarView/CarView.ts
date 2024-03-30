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
  public selectBtn = new Button({ classNames: ['select-btn'], text: 'select' });
  public removeBtn = new Button({ classNames: ['remove-btn'], text: 'remove' });
  public startBtn = new Button({ classNames: ['start-btn'], text: 'start' });
  public stopBtn = new Button({ classNames: ['stop-btn'], text: 'stop' });
  public carImg = new BaseComponent({ tag: 'div', classNames: [styles.carImg] });

  public carName = new BaseComponent({ tag: 'div', classNames: ['car-name'] });

  public id: number = 0;

  constructor(data: CarData) {
    super({ tag: 'div', classNames: [styles.carBlock] });
    this.id = data.id;
    this.element.id = data.id.toString();
    this.createView(data);
    this.removeBtn.on('click', this.clickOnRemoveBtn);
    this.startBtn.on('click', this.clickOnStartBtn);
    this.stopBtn.on('click', this.clickOnStopBtn);
    this.selectBtn.on('click', this.clickOnSelectBtn);
    emitter.on('startMoving', this.animateCar);
    emitter.on('stopMoving', this.stopMoving);
    emitter.on('updateCar', this.updateCarView);
    emitter.on('toStart', this.moveCarToStart);
  }
  protected createView(data: CarData) {
    // console.log('carview', data);
    // const carName = new BaseComponent({ tag: 'div', classNames: ['car-name'], text: data.name });
    this.carName.setTextContent(data.name);
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons-box'] });
    const controls = new BaseComponent({ tag: 'div', classNames: ['controls-box'] });
    const flag = new BaseComponent({ tag: 'div', classNames: [styles.flagIcon] });

    this.carImg.html(carIcon(data.color));

    buttons.append(this.selectBtn, this.removeBtn);
    controls.append(this.startBtn, this.stopBtn);
    this.append(this.carName, buttons, controls, this.carImg, flag);
  }

  protected clickOnRemoveBtn = () => {
    // const id = this.attr('id');
    // if (typeof id !== 'string') {
    //   throw new Error('id is not string');
    // }
    deleteCar(this.id);
  };

  public clickOnStartBtn = () => {
    console.log('status=', state.getCarStatus(this.id));
    this.fetchController = new AbortController();
    startCar(this.id, 'started', this.fetchController);
  };

  public clickOnStopBtn = () => {
    // console.log('id=', this.id);
    // console.log('name=', this.carName);
    // console.log('status =', state.getCarStatus(this.id));

    // console.log('clickstop');
    const status = state.getCarStatus(this.id);
    if (status === 'drive' || status === 'broken') {
      stopCar(this.id, this.fetchController);
      // console.log('send request', this.id);
      // this.fetchController.abort();
      // this.stopMoving(this.id);
    }

    // state.setCarStatusStop(this.id);
  };

  protected moveCarToStart = (id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not number');
    }
    if (this.id !== id) {
      return;
    }
    console.log('car move to start');
    this.stopMoving(this.id);
    this.carImg.css('transform', `translateX(0px)`);
  };

  protected clickOnSelectBtn = () => {
    emitter.emit('enableUpdateForm', this.element.id);
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
  public animateCar = (duration: unknown, id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not number');
    }

    if (this.id !== id) {
      return;
    }
    if (typeof duration !== 'number') {
      throw new Error('duration is not number');
    }
    // const car = document.getElementById('car');
    // const distance = endX - startX;
    const distance = getDistance(this.carImg.element);
    const speed = distance / duration;
    const startX = 0;
    let startTime: number = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const newX = startX + speed * progress;

      // this.carImg.element.style.transform = `translateX(${newX}px)`;
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

    cancelAnimationFrame(this.animationId);
  };
}
