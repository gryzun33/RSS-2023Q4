import BaseComponent from '../BaseComponent';
import CarView from '../CarView/CarView';
import CreateCarForm from '../CreateCarForm';
import UpdateCarForm from '../UpdateCarForm';
import { CarData } from '../../utils/types';

export default class GarageView extends BaseComponent {
  protected createForm = new CreateCarForm();
  protected updateForm = new UpdateCarForm();

  protected garageList = new BaseComponent({ tag: 'div', classNames: ['garage-list'] });
  protected totalCars: number = 0;
  protected page: number = 1;
  constructor() {
    super({ tag: 'div', classNames: ['garage-wrapper'] });
    this.createView();
  }

  protected createView(): void {
    this.append(this.createForm, this.updateForm, this.garageList);
  }

  public addNewCar(car: CarData): void {
    const newCar = new CarView(car);
    this.garageList.append(newCar);
  }
}
