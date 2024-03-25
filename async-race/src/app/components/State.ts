import { CarData } from '../utils/types';
// import isCarData from '../utils/predicates';
import emitter from './EventEmitter';

class State {
  public isStart: boolean = true;

  public allCarsCount: number = 0;

  public currPage: number = 2;
  public carsOnPage: number = 0;

  // public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  public addCarToState = (car: CarData) => {
    // this.cars.push(car);
    this.carsMap.set(car.id, car);
    emitter.emit('addNewCar', car);
  };

  public addCarsToState(cars: CarData[]) {
    emitter.emit('destroyGarageView');
    this.carsMap.clear();
    cars.forEach((car) => {
      this.addCarToState(car);
    });
  }

  // public deleteCarFromState(id: string) {
  //   this.carsMap.delete(Number(id));
  // }
}

const state = new State();

export default state;
