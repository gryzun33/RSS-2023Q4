import { CarData } from './types';

export default function isCarData(car: unknown): car is CarData {
  return typeof car === 'object' && car !== null && 'id' in car;
}
