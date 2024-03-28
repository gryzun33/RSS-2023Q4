import styles from './garageview.module.scss';
import BaseComponent from '../BaseComponent';
import CarView from '../CarView/CarView';
import CreateCarForm from '../CreateCarForm';
import UpdateCarForm from '../UpdateCarForm';
// import { CarData } from '../../utils/types';
import emitter from '../EventEmitter';
import isCarData from '../../utils/predicates';
import Button from '../Button';
import getRandomCars from '../../utils/getRandomCars';
import { addRandomCars, getCars } from '../../api';
import { NewCarData } from '../../utils/types';
import state from '../State';

export default class GarageView extends BaseComponent {
  protected createForm = new CreateCarForm();
  protected updateForm = new UpdateCarForm();

  public raceBtn = new Button({ classNames: ['race-btn'], text: 'race' });
  public resetBtn = new Button({ classNames: ['reset-btn'], text: 'reset' });
  public generateBtn = new Button({ classNames: ['generate-btn'], text: 'generate cars' });

  public garageTitle = new BaseComponent({ tag: 'p', classNames: ['garage-title'] });

  public pageTitle = new BaseComponent({ tag: 'p', classNames: ['page-title'] });

  public firstTitle = new BaseComponent({ tag: 'p', classNames: [styles.firstTitle] });
  protected garageList = new BaseComponent({ tag: 'div', classNames: [styles.garageList] });

  protected prevBtn = new Button({ classNames: ['prev-btn'], text: 'prev' });
  protected nextBtn = new Button({ classNames: ['next-btn'], text: 'next' });
  // protected totalCars: number = 0;
  // protected page: number = 1;
  protected cars: CarView[] = [];
  constructor() {
    super({ tag: 'div', classNames: [styles.garageWrapper] });
    this.createView();
    emitter.on('addNewCar', this.addNewCarToView);
    emitter.on('destroyGarageView', this.destroyGarage);
    emitter.on('updateCount', this.updateCarsCount);
    emitter.on('updatePage', this.updatePages);
    emitter.on('showWinner', this.showWinner);
    this.generateBtn.on('click', this.onClickGenerateBtn);
    this.prevBtn.on('click', this.onClickPrevBtn);
    this.nextBtn.on('click', this.onClickNextBtn);
    this.raceBtn.on('click', this.onClickRaceBtn);
    this.resetBtn.on('click', this.onClickResetBtn);
  }

  protected createView(): void {
    const buttonsBlock = new BaseComponent({ tag: 'div', classNames: ['buttons-block'] });
    buttonsBlock.append(this.raceBtn, this.resetBtn, this.generateBtn);
    const pagination = new BaseComponent({ tag: 'div', classNames: ['pagination'] });
    pagination.append(this.prevBtn, this.nextBtn);
    this.append(
      this.firstTitle,
      this.createForm,
      this.updateForm,
      buttonsBlock,
      this.garageTitle,
      this.pageTitle,
      this.garageList,
      pagination
    );
  }

  public updateCarsCount = (count: unknown) => {
    if (typeof count !== 'number') {
      throw new Error('count is not number');
    }
    this.garageTitle.setTextContent(`Garage(${count})`);
  };

  public updatePages = (page: unknown, prevBtnState: unknown, nextBtnState: unknown) => {
    if (typeof page !== 'number') {
      throw new Error('count is not number');
    }
    if (typeof prevBtnState !== 'boolean' || typeof nextBtnState !== 'boolean') {
      throw new Error('state of pagination is not boolean');
    }

    this.pageTitle.setTextContent(`Page N${page}`);
    this.prevBtn.element.disabled = !prevBtnState;
    this.nextBtn.element.disabled = !nextBtnState;
  };

  public addNewCarToView = (car: unknown): void => {
    if (!isCarData(car)) {
      throw new Error('argument is not type CarData');
    }

    const newCar = new CarView(car);
    this.cars.push(newCar);
    // console.log('cars=', this.cars);
    this.garageList.append(newCar);
  };

  protected destroyGarage = () => {
    this.cars = [];
    if (this.garageList.children) {
      // console.log('children=', this.garageList.children);
      this.garageList.destroyChildren();
    }
  };

  protected onClickGenerateBtn = (): void => {
    const newCars: NewCarData[] = getRandomCars();
    addRandomCars(newCars);
  };

  protected onClickPrevBtn = (): void => {
    getCars(state.currPage - 1);
  };
  protected onClickNextBtn = (): void => {
    getCars(state.currPage + 1);
  };

  protected onClickRaceBtn = (): void => {
    state.setRaceState(true);
    this.cars.forEach((car) => {
      car.clickOnStartBtn();
      // startCar(car.id, 'started', car.fetchController);
    });
  };

  protected onClickResetBtn = (): void => {
    state.setRaceState(false);
    state.setWinner(0);
    this.cars.forEach((car) => {
      car.clickOnStopBtn();
    });
    this.firstTitle.setTextContent('');
  };

  protected showWinner = (carData: unknown): void => {
    if (!isCarData(carData)) {
      throw new Error('argument is not type CarData');
    }
    const time = (carData.duration / 1000).toFixed(2);
    this.firstTitle.setTextContent(`${carData.name} went first in ${time}`);
  };
}
