import { CarData, NewCarData } from './utils/types';

const baseURL = 'http://127.0.0.1:3000';

const path = {
  garage: '/garage',
  winners: '/winners',
};

type Params = {
  key: string;
  value: string;
};

function getQueryString(params: Params[] = []) {
  const str =
    params.length > 0 ? `${params.map((el: Params) => `${el.key}=${el.value}`).join('&')}` : '';
  return str;
}

export async function getCars(callback: (cars: CarData[]) => void, params: Params[] = []) {
  try {
    const response = await fetch(`${baseURL}${path.garage}${getQueryString(params)}`);
    const data = await response.json();
    callback(data);
    // console.log('cars', data);
    // return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    // return null;
  }
}

export async function createCar(callback: (car: CarData) => void, newCarData: NewCarData) {
  try {
    const response = await fetch(`${baseURL}${path.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCarData),
    });
    const data = await response.json();
    callback(data);
    // console.log('cars', data);
    // return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    // return null;
  }
}
