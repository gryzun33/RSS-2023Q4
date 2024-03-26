import { NewCarData } from './utils/types';
import state from './components/State';
import { limitCarsOnPage } from './utils/constants';

const baseURL = 'http://127.0.0.1:3000';

const path = {
  garage: '/garage',
  winners: '/winners',
  engine: '/engine',
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

    if (data.length === 0 && state.currPage > 1) {
      state.currPage -= 1;
      getCars([
        { key: '_page', value: String(state.currPage) },
        { key: '_limit', value: String(limitCarsOnPage) },
      ]);
    } else {
      state.addCarsToState(data);
      state.carsOnPage = data.length;
      state.allCarsCount = Number(response.headers.get('X-Total-Count'));
      console.log('headers', response.headers.get('X-Total-Count'));
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
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
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function updateCar(id: string, newCarData: NewCarData) {
  try {
    const response = await fetch(`${baseURL}${path.garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCarData),
    });
    const data = await response.json();
    state.updateCarInState(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function deleteCar(id: string) {
  try {
    const response = await fetch(`${baseURL}${path.garage}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    getCars([
      { key: '_page', value: String(state.currPage) },
      { key: '_limit', value: String(limitCarsOnPage) },
    ]);

    // state.deleteCarFromState(id);
    console.log('deletecar', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function driveCar(id: string, status: string) {
  try {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    if (response.status === 500) {
      state.setCarStatusBroken(id);
    }
    if (response.status === 200) {
      const data = await response.json();
      console.log('driveCar=', data);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function startCar(id: string, status: string) {
  try {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    const data = await response.json();
    driveCar(id, 'drive');
    state.setCarStatusDrive(id, data);
    console.log('datastartCar=', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

// export async function startCar(params: Params[] = []) {
//   try {
//     const response = await fetch(`${baseURL}${path.engine}${getQueryString(params)}`, {
//       method: 'PATCH',
//     });

//     console.log('params= ', params);

//     const data = await response.json();
//     console.log('datastartCar=', data);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Error:', error.message);
//     }
//   }
// }
