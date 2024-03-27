import { CarData } from '../utils/types';
// import isCarData from '../utils/predicates';
import emitter from './EventEmitter';
import { limitCarsOnPage } from '../utils/constants';

type EngineData = {
  velocity: number;
  distance: number;
};

class State {
  public isStart: boolean = true;

  public allCarsCount: number = 0;

  public currPage: number = 1;
  public carsOnPage: number = 0;

  public prevBtn: boolean = false;
  public nextBtn: boolean = true;

  // public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  public addCarToState = (car: CarData) => {
    const newCar: CarData = {
      ...car,
      status: 'stop',
    };
    // this.cars.push(car);
    this.carsMap.set(car.id, newCar);
    emitter.emit('addNewCar', newCar);
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

  public updateGarageData(cars: CarData[], count: number, numb: number) {
    this.addCarsToState(cars);
    this.updateAllCarsCount(count);
    this.updatePageNumber(numb);
  }

  public updateAllCarsCount(newCount: number) {
    if (this.allCarsCount !== newCount) {
      this.allCarsCount = newCount;
      emitter.emit('updateCount', newCount);
    }
  }

  public getCurrentPage(): number {
    return this.currPage;
  }

  public updatePageNumber(newPage: number) {
    this.currPage = newPage;
    if (this.currPage === 1) {
      this.prevBtn = false;
    } else {
      this.prevBtn = true;
    }
    if (Math.ceil(this.allCarsCount / limitCarsOnPage) === this.currPage) {
      this.nextBtn = false;
    } else {
      this.nextBtn = true;
    }
    emitter.emit('updatePage', newPage, this.prevBtn, this.nextBtn);
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

  public getCarStatus(id: string) {
    const carData = this.carsMap.get(+id);
    if (!carData) {
      throw new Error('cardData is undefined');
    }
    const { status } = carData;
    return status;
  }
}

const state = new State();

export default state;
