import { CarData } from '../utils/types';

class State {
  public isStart = true;

  public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  public addCarToGarage(car: CarData) {
    this.cars.push(car);
    this.carsMap.set(car.id, car);
  }
}

const state = new State();

export default state;
