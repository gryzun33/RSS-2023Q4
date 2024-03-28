import { CarData, NewCarData } from './utils/types';
import state from './components/State';
import { limitCarsOnPage } from './utils/constants';

const baseURL = 'http://127.0.0.1:3000';

const path = {
  garage: '/garage',
  winners: '/winners',
  engine: '/engine',
};

// type Params = {
//   key: string;
//   value: string;
// };

// function getQueryString(params: Params[] = []) {
//   const str =
//     params.length > 0 ? `?${params.map((el: Params) => `${el.key}=${el.value}`).join('&')}` : '';
//   console.log('string=', str);
//   return str;
// }

// export async function updateWinner(id: number) {
//   fetch(`${baseURL}${path.winners}/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(state.getWinnerData(id)),
//   })
//     .then((response) => {
//       console.log('response =', response);
//       if (!response.ok) {
//         throw new Error(`${response.status}`);
//       }

//       return response.json();
//     })
//     .then((data) => {
//       console.log('Data received:', data);
//     })
//     .catch((error) => {
//       console.log('fdgfhdfh');
//       if (error instanceof Error) {
//         console.error('Error:', error.message);
//       }
//     })
//     .finally(() => {
//       console.log('Request completed');
//     });
// }

export async function getCars(page: number) {
  try {
    const response = await fetch(
      `${baseURL}${path.garage}?_page=${page}&_limit=${limitCarsOnPage}}`
    );
    const data: CarData[] = await response.json();
    console.log('data31=', data);

    if (data.length === 0 && state.currPage > 1) {
      state.currPage -= 1;
      getCars(state.currPage);
    } else {
      console.log('ggggggg');
      const carsCount = Number(response.headers.get('X-Total-Count'));
      state.updateGarageData(data, carsCount, page);
      // state.addCarsToState(data);
      // state.carsOnPage = data.length;

      // state.updateAllCarsCount(Number(response.headers.get('X-Total-Count')));
      // state.allCarsCount = Number(response.headers.get('X-Total-Count'));
      // console.log('headers', response.headers.get('X-Total-Count'));
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

    console.log('newcar=', data);

    getCars(state.currPage);
    // if (state.carsOnPage < limitCarsOnPage) {
    //   state.carsOnPage += 1;
    //   state.addCarToState(data);
    // }
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

export async function deleteCar(id: number) {
  try {
    const response = await fetch(`${baseURL}${path.garage}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    getCars(state.currPage);

    // state.deleteCarFromState(id);
    console.log('deletecar', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function driveCar(id: number, status: string, controller: AbortController) {
  try {
    // controller = new AbortController();
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
      signal: controller.signal,
    });

    if (response.status === 500) {
      state.setCarStatusBroken(id);
    }
    if (response.status === 200) {
      if (!state.winner && state.race) {
        state.setRaceState(false);
        // state.setWinner(id);
        console.log('WINNER ID=', id);
        // updateWinner(id);
      }
      // const data = await response.json();

      // console.log('driveCar=', data);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  // return fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
  //   method: 'PATCH',
  //   signal: controller.signal,
  // })
  //   .then(({ status }) => {
  //     return true;
  //   })
  //   .catch((error) => {
  //     if (error instanceof Error) {
  //       console.log(error);
  //       console.error(error.message);
  //     }
  //   });
}

export async function startCar(id: number, status: string, controller: AbortController) {
  try {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    const data = await response.json();
    driveCar(id, 'drive', controller);
    state.setCarStatusDrive(id, data);
    // console.log('datastartCar=', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function stopCar(id: number, controller: AbortController) {
  try {
    await fetch(`${baseURL}${path.engine}?id=${id}&status=stopped`, {
      method: 'PATCH',
    });
    controller.abort();
    state.setCarStatusStop(id);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function addRandomCars(newCars: NewCarData[]) {
  try {
    const promises = newCars.map((carData: NewCarData) =>
      fetch(`${baseURL}${path.garage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      })
    );
    await Promise.all(promises);

    getCars(state.currPage);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}
