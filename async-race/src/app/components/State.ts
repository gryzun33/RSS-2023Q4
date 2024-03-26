import { CarData } from '../utils/types';
// import isCarData from '../utils/predicates';
import emitter from './EventEmitter';

type EngineData = {
  velocity: number;
  distance: number;
};

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

  public updateCarInState = (car: CarData) => {
    // this.cars.push(car);
    this.carsMap.set(car.id, car);
    emitter.emit('updateCar', car);
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

  public setCarStatusDrive(id: string, engineData: EngineData) {
    const duration = engineData.distance / engineData.velocity;
    const carData = this.carsMap.get(+id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'drive';
    emitter.emit('startMoving', duration, id);
  }

  public setCarStatusBroken(id: string) {
    const carData = this.carsMap.get(+id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'broken';
    emitter.emit('stopMoving', id);
  }

  public setCarStatusStop(id: string) {
    const carData = this.carsMap.get(+id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'stop';
  }
}

const state = new State();

export default state;
