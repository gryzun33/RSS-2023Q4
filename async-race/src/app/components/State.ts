import { CarData } from '../utils/types';
import isCarData from '../utils/predicates';
import emitter from './EventEmitter';

class State {
  public isStart = true;

  public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  constructor() {
    emitter.on('addNewCar', this.addCarToGarage);
  }

  public addCarToGarage = (car: unknown) => {
    if (!isCarData(car)) {
      throw new Error('argument is not type CarData');
    }
    this.cars.push(car);
    this.carsMap.set(car.id, car);
  };
}

const state = new State();

export default state;
