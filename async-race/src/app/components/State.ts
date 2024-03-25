import { CarData } from '../utils/types';
// import isCarData from '../utils/predicates';
import emitter from './EventEmitter';

class State {
  public isStart: boolean = true;

  public allCarsCount: number = 0;

  public currPage: number = 3;
  public carsOnPage: number = 0;

  public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  // constructor() {
  // emitter.on('addNewCar', this.addCarToGarage);
  // }

  public addCarToState = (car: CarData) => {
    // if (!isCarData(car)) {
    //   throw new Error('argument is not type CarData');
    // }
    this.cars.push(car);
    this.carsMap.set(car.id, car);
    emitter.emit('addNewCar', car);
  };

  public addCarsToState(cars: CarData[]) {
    cars.forEach((car) => {
      this.addCarToState(car);
    });
  }
}

const state = new State();

export default state;
