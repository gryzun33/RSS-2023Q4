import { NewCarData } from './utils/types';
import state from './components/State';
import { limitCarsOnPage } from './utils/constants';

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
    params.length > 0 ? `?${params.map((el: Params) => `${el.key}=${el.value}`).join('&')}` : '';
  console.log('string=', str);
  return str;
}

export async function getCars(params: Params[] = []) {
  try {
    const response = await fetch(`${baseURL}${path.garage}${getQueryString(params)}`);
    const data = await response.json();
    state.addCarsToState(data);
    state.carsOnPage = data.length;
    state.allCarsCount = Number(response.headers.get('X-Total-Count'));
    console.log('headers', response.headers.get('X-Total-Count'));
    // console.log('cars', data);
    // return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    // return null;
  }
}

export async function createCar(newCarData: NewCarData) {
  try {
    const response = await fetch(`${baseURL}${path.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCarData),
    });
    const data = await response.json();

    console.log('carsonpge=', state.carsOnPage);
    if (state.carsOnPage < limitCarsOnPage) {
      state.carsOnPage += 1;
      state.addCarToState(data);
    }

    // console.log('cars', data);
    // return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    // return null;
  }
}
