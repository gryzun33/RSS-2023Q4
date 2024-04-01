import styles from './garageview.module.scss';
import BaseComponent from '../utilsComponents/BaseComponent';
import CarView from '../CarView/CarView';
import CreateCarForm from '../CreateCarForm/CreateCarForm';
import UpdateCarForm from '../UpdateCarForm/UpdateCarForm';
import emitter from '../EventEmitter';
import isCarData from '../../utils/predicates';
import Button from '../utilsComponents/Button';
import getRandomCars from '../../utils/getRandomCars';
import { addRandomCars, getCars } from '../api';
import { NewCarData, FormState } from '../../utils/types';
import state from '../State';

enum Forms {
  CreateForm = 'createForm',
  UpdateForm = 'updateForm',
}

export default class GarageView extends BaseComponent {
  protected createForm = new CreateCarForm(Forms.CreateForm);
  protected updateForm = new UpdateCarForm(Forms.UpdateForm);

  protected forms = [this.createForm, this.updateForm];

  public raceBtn = new Button({ classNames: [styles.raceBtn], text: 'Race' });
  public resetBtn = new Button({ classNames: [styles.resetBtn], text: 'Reset', disabled: true });
  public generateBtn = new Button({ classNames: [styles.generateBtn], text: 'Generate Cars' });

  public garageTitle = new BaseComponent({ tag: 'p', classNames: [styles.garageTitle] });

  public pageTitle = new BaseComponent({ tag: 'p', classNames: [styles.pageTitle] });

  public firstTitle = new BaseComponent({ tag: 'p', classNames: [styles.firstTitle] });
  protected garageList = new BaseComponent({ tag: 'div', classNames: [styles.garageList] });

  protected prevBtn = new Button({ classNames: [styles.prevBtn] });
  protected nextBtn = new Button({ classNames: [styles.nextBtn] });
  protected cars: CarView[] = [];
  constructor(protected winnersBtn: Button) {
    super({ tag: 'div', classNames: [styles.garageWrapper] });
    this.createView();
    getCars(state.currPage);
    this.updateFormsView();
    emitter.on('addNewCar', this.addNewCarToView);
    emitter.on('destroyGarageView', this.destroyGarage);
    emitter.on('updateCount', this.updateCarsCount);
    emitter.on('updatePage', this.updatePages);
    emitter.on('showWinner', this.showWinner);
    emitter.on('finishRace', this.enableWinnersBtn);
    this.generateBtn.on('click', this.onClickGenerateBtn);
    this.prevBtn.on('click', this.onClickPrevBtn);
    this.nextBtn.on('click', this.onClickNextBtn);
    this.raceBtn.on('click', this.onClickRaceBtn);
    this.resetBtn.on('click', this.onClickResetBtn);
  }

  protected createView(): void {
    const topBlock = new BaseComponent({ tag: 'div', classNames: [styles.topBlock] });
    const buttonsBlock = new BaseComponent({ tag: 'div', classNames: [styles.buttonsBlock] });
    buttonsBlock.append(this.raceBtn, this.resetBtn, this.generateBtn);
    topBlock.append(this.createForm, this.updateForm, buttonsBlock, this.garageTitle);
    const pagination = new BaseComponent({ tag: 'div', classNames: [styles.pagination] });
    pagination.append(this.prevBtn, this.pageTitle, this.nextBtn);
    this.append(this.firstTitle, topBlock, this.garageList, pagination);
  }

  protected updateFormsView() {
    const formsState = state.getGarageFormsState();
    if (formsState.length === 0) return;
    this.forms.forEach((form) => {
      const formState = formsState.find((fstate) => fstate.formName === form.formName);
      if (!formState) {
        throw new Error('formstate is undefined');
      }
      form.updateView(formState);
    });
  }

  public updateCarsCount = (count: unknown) => {
    if (typeof count !== 'number') {
      throw new Error('count is not number');
    }
    this.garageTitle.setTextContent(`Garage (${count})`);
  };

  public updatePages = (page: unknown, prevBtnState: unknown, nextBtnState: unknown) => {
    if (typeof page !== 'number') {
      throw new Error('count is not number');
    }
    if (typeof prevBtnState !== 'boolean' || typeof nextBtnState !== 'boolean') {
      throw new Error('state of pagination is not boolean');
    }

    this.pageTitle.setTextContent(`${page}`);
    this.prevBtn.element.disabled = !prevBtnState;
    this.nextBtn.element.disabled = !nextBtnState;
  };

  public addNewCarToView = (car: unknown): void => {
    if (!isCarData(car)) {
      throw new Error('argument is not type CarData');
    }

    const newCar = new CarView(car);
    this.cars.push(newCar);
    this.garageList.append(newCar);
  };

  protected destroyGarage = () => {
    this.cars = [];
    if (this.garageList.children) {
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
    });
    this.resetBtn.disable();
    this.raceBtn.disable();
    this.winnersBtn.disable();
  };

  protected onClickResetBtn = (): void => {
    state.setRaceState(false);
    state.setWinner(0);
    this.cars.forEach((car) => {
      car.clickOnStopBtn();
    });
    this.firstTitle.setTextContent('');
    this.raceBtn.enable();
    this.resetBtn.disable();
  };

  protected showWinner = (carData: unknown): void => {
    if (!isCarData(carData)) {
      throw new Error('argument is not type CarData');
    }
    const time = (carData.duration / 1000).toFixed(2);
    this.firstTitle.setTextContent(`${carData.name} went first in ${time}s`);
    this.resetBtn.enable();
  };

  protected enableWinnersBtn = (): void => {
    this.winnersBtn.enable();
  };

  public getFormsState(): FormState[] {
    const formsState: FormState[] = [];
    this.forms.forEach((form) => {
      const { name, color, id } = form.getInputsValues();
      const formState = {
        formName: form.formName,
        disabled: form.disabled,
        nameInput: name,
        colorInput: color,
        currentId: id,
      };
      formsState.push(formState);
    });
    return formsState;
  }
}
