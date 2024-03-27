import cars from './carsData';
import { RandomCar, NewCarData } from './types';
import { randomCarsCount } from './constants';

function getRandomModel(randomCars: RandomCar[]): string {
  const randomBrandIndex = Math.floor(Math.random() * randomCars.length);
  const randomBrandObj = randomCars[randomBrandIndex];
  const brand = Object.keys(randomBrandObj)[0];
  const models = randomBrandObj[brand];
  const randomModelIndex = Math.floor(Math.random() * models.length);
  const model = models[randomModelIndex];
  return `${brand} ${model}`;
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function getRandomCars(): NewCarData[] {
  const carsArr = [];
  for (let i = 0; i < randomCarsCount; i += 1) {
    const randomCar = {
      name: getRandomModel(cars),
      color: getRandomColor(),
    };
    carsArr.push(randomCar);
  }

  return carsArr;
}
