import BaseComponent from '../BaseComponent';
import CarView from '../CarView/CarView';
import CreateCarForm from '../CreateCarForm';
import UpdateCarForm from '../UpdateCarForm';
// import { CarData } from '../../utils/types';
import emitter from '../EventEmitter';
import isCarData from '../../utils/predicates';
import Button from '../Button';
import getRandomCars from '../../utils/getRandomCars';
import { addRandomCars } from '../../api';
import { NewCarData } from '../../utils/types';

export default class GarageView extends BaseComponent {
  protected createForm = new CreateCarForm();
  protected updateForm = new UpdateCarForm();

  public raceBtn = new Button({ classNames: ['race-btn'], text: 'race' });
  public resetBtn = new Button({ classNames: ['reset-btn'], text: 'reset' });
  public generateBtn = new Button({ classNames: ['generate-btn'], text: 'generate cars' });

  public garageTitle = new BaseComponent({ tag: 'p', classNames: ['garage-title'] });

  public pageTitle = new BaseComponent({ tag: 'p', classNames: ['page-title'] });
  protected garageList = new BaseComponent({ tag: 'div', classNames: ['garage-list'] });
  protected totalCars: number = 0;
  protected page: number = 1;
  constructor() {
    super({ tag: 'div', classNames: ['garage-wrapper'] });
    this.createView();
    emitter.on('addNewCar', this.addNewCarToView);
    emitter.on('destroyGarageView', this.destroyGarage);
    emitter.on('updateCount', this.updateCarsCount);
    emitter.on('updatePage', this.updatePages);
    this.generateBtn.on('click', this.onClickGenerateBtn);
  }

  protected createView(): void {
    const buttonsBlock = new BaseComponent({ tag: 'div', classNames: ['buttons-block'] });
    buttonsBlock.append(this.raceBtn, this.resetBtn, this.generateBtn);
    this.append(
      this.createForm,
      this.updateForm,
      buttonsBlock,
      this.garageTitle,
      this.pageTitle,
      this.garageList
    );
  }

  public updateCarsCount = (count: unknown) => {
    if (typeof count !== 'number') {
      throw new Error('count is not number');
    }
    this.garageTitle.setTextContent(`Garage(${count})`);
  };

  public updatePages = (page: unknown, prevBtn: unknown, nextBtn: unknown) => {
    if (typeof page !== 'number') {
      throw new Error('count is not number');
    }
    if (typeof prevBtn !== 'boolean' || typeof nextBtn !== 'boolean') {
      throw new Error('state of pagination is not boolean');
    }

    this.pageTitle.setTextContent(`Page N${page}`);
  };

  public addNewCarToView = (car: unknown): void => {
    if (!isCarData(car)) {
      throw new Error('argument is not type CarData');
    }

    const newCar = new CarView(car);
    this.garageList.append(newCar);
  };

  protected destroyGarage = () => {
    if (this.garageList.children) {
      // console.log('children=', this.garageList.children);
      this.garageList.destroyChildren();
    }
  };

  protected onClickGenerateBtn(): void {
    const newCars: NewCarData[] = getRandomCars();
    addRandomCars(newCars);
  }
}
