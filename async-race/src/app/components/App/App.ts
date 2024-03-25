import styles from './app.module.scss';
import Button from '../Button';
import BaseComponent from '../BaseComponent';
import { getCars } from '../../api';
import GarageView from '../GarageView/GarageView';
// import BaseComponent from '../BaseComponent';
import state from '../State';
import { CarData } from '../../utils/types';

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

  protected garageView?: GarageView;

  public start(): void {
    this.createView();

    // const data = getCars();
    // console.log('dataApp', data);
  }

  protected createView(): void {
    const btnBox = new BaseComponent({ tag: 'div', classNames: ['btn-box'] });
    btnBox.append(this.garageBtn, this.winnersBtn);
    this.root.append(btnBox);
    document.body.append(this.root.getElement());

    this.createGarageView();
  }

  protected createGarageView() {
    this.garageView = new GarageView();
    this.root.append(this.garageView);
    if (state.isStart) {
      state.isStart = false;
      getCars(this.addCarsToApp);
    }
  }

  public addCarsToApp = (cars: CarData[]) => {
    cars.forEach((car: CarData) => {
      state.addCarToGarage(car);
      if (this.garageView) {
        this.garageView.addNewCar(car);
      }
    });
  };
}
