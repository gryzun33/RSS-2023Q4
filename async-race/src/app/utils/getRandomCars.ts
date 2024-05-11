import carsData from './carsData';
import { RandomCar, NewCarData } from './types';
import { randomCarsCount } from './constants';

function getRandomModel(cars: RandomCar[]): string {
  const brandIndex = getRandomIndex(cars.length);
  const brandWithModels = cars[brandIndex];
  const [brand, models] = Object.entries(brandWithModels)[0];
  const modelIndex = getRandomIndex(models.length);
  const model = models[modelIndex];
  return `${brand} ${model}`;
}

function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
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
      name: getRandomModel(carsData),
      color: getRandomColor(),
    };
    carsArr.push(randomCar);
  }

  return carsArr;
}
