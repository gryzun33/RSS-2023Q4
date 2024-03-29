import {
  CarData /* , NewCarData */,
  NewWinnerData,
  WinnerData,
  SortState,
  OrderState,
} from '../utils/types';
// import isCarData from '../utils/predicates';
import emitter from './EventEmitter';
import { limitCarsOnPage, limitWinners } from '../utils/constants';
// import { NewWinnerData } from '../utils/types';

type EngineData = {
  velocity: number;
  distance: number;
};

class State {
  public race: boolean = false;
  public winner: number = 0;
  public isStart: boolean = true;

  public allCarsCount: number = 0;
  public allWinnersCount: number = 0;

  public currPage: number = 1;

  public winnersPage: number = 1;
  public carsOnPage: number = 0;

  public prevBtn: boolean = false;
  public nextBtn: boolean = true;

  public prevWinners: boolean = false;
  public nextWinners: boolean = false;

  protected promisesCount: number = 0;

  public sort: string = SortState.none;
  public order: string = OrderState.none;

  // public cars: CarData[] = [];

  public carsMap = new Map<number, CarData>();

  public setRaceState(raceState: boolean) {
    this.race = raceState;
  }

  public setWinner(id: number): void {
    this.winner = id;
    if (id === 0) {
      return;
    }
    const carData = this.carsMap.get(id);
    emitter.emit('showWinner', carData);
  }

  public setWinnerData(data: NewWinnerData): void {
    const carData = this.carsMap.get(data.id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    const timeInSec = data.time * 1000;
    carData.wins = data.wins + 1;
    carData.duration = timeInSec < carData.duration ? timeInSec : carData.duration;
  }

  public getWinnerData(id: number): WinnerData {
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    const timeInSec = +(carData.duration / 1000).toFixed(2);
    return { wins: carData.wins, time: timeInSec };
  }

  // public getWinnerId(): number {
  //   return this.winner;
  // }

  public getFisrtWinnerData(id: number): NewWinnerData {
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    // carData.wins += 1;
    const timeInSec = +(carData.duration / 1000).toFixed(2);
    return { id: carData.id, wins: 1, time: timeInSec };
  }

  public addCarToState = (car: CarData) => {
    const newCar: CarData = {
      ...car,
      status: 'stop',
      wins: 0,
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

  public setCarStatusDrive(id: number, engineData: EngineData) {
    const duration = engineData.distance / engineData.velocity;
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'drive';
    carData.duration = duration;
    emitter.emit('startMoving', duration, id);
  }

  public setCarStatusBroken(id: number) {
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'broken';
    emitter.emit('stopMoving', id);
  }

  public setCarStatusStop(id: number) {
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    carData.status = 'stop';
    console.log('car stopped');
    emitter.emit('toStart', id);
  }

  public getCarStatus(id: number) {
    const carData = this.carsMap.get(id);
    if (!carData) {
      throw new Error('cardData is undefined');
    }
    const { status } = carData;
    return status;
  }

  public updatePromisesCount() {
    state.promisesCount += 1;
    console.log('count=', state.promisesCount);
    if (state.promisesCount === this.carsMap.size) {
      emitter.emit('finishRace');
      // console.log('finishRace');
      state.promisesCount = 0;
    }
  }

  public setWinners(winners: NewWinnerData[], cars: CarData[]) {
    // console.log('winners=', winners);
    // console.log('cars=', cars);

    const winnersData = winners.map((winner, i) => {
      const obj = {
        id: winner.id,
        wins: winner.wins,
        time: winner.time,
        color: cars[i].color,
        name: cars[i].name,
      };
      return obj;
    });
    console.log(winnersData);
    // data.forEach(())
    emitter.emit('updateWinnersView', winnersData, this.winnersPage);
  }

  public setWinnersCount(count: number) {
    this.allWinnersCount = count;
    emitter.emit('updateWinnersCount', count);
  }

  // public getWinnersCount(): number {
  //   return this.allWinnersCount;
  // }

  public setWinnersPage(page: number) {
    this.winnersPage = page;
    if (this.winnersPage === 1) {
      this.prevWinners = false;
    } else {
      this.prevWinners = true;
    }
    if (Math.ceil(this.allWinnersCount / limitWinners) === this.winnersPage) {
      this.nextWinners = false;
    } else {
      this.nextWinners = true;
    }

    emitter.emit('updateWinnersPage', page, this.prevWinners, this.nextWinners);
  }

  public setOrderAndSortState(sort: string, order: string) {
    this.sort = sort;
    this.order = order;
  }
}

const state = new State();

export default state;
