import { CarData, NewCarData, Params, NewWinnerData } from '../utils/types';
import state from './State';
import { limitCarsOnPage } from '../utils/constants';

const baseURL = 'http://127.0.0.1:3000';

const path = {
  garage: '/garage',
  winners: '/winners',
  engine: '/engine',
};

function getQueryString(params: Params[] = []) {
  const str =
    params.length > 0 ? `?${params.map((el: Params) => `${el.key}=${el.value}`).join('&')}` : '';
  return str;
}

export async function getCars(page: number) {
  try {
    const response = await fetch(
      `${baseURL}${path.garage}?_page=${page}&_limit=${limitCarsOnPage}}`
    );
    const data: CarData[] = await response.json();

    if (data.length === 0 && state.currPage > 1) {
      state.currPage -= 1;
      getCars(state.currPage);
    } else {
      const carsCount = Number(response.headers.get('X-Total-Count'));
      state.updateGarageData(data, carsCount, page);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function createCar(newCarData: NewCarData) {
  try {
    await fetch(`${baseURL}${path.garage}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCarData),
    });

    getCars(state.currPage);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

export async function updateCar(id: number, newCarData: NewCarData) {
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

export async function deleteWinner(id: number) {
  fetch(`${baseURL}${path.winners}/${id}`, {
    method: 'DELETE',
  }).catch((error) => {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  });
}

export function deleteCar(id: number) {
  fetch(`${baseURL}${path.garage}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      getCars(state.currPage);
    })
    .then(() => {
      deleteWinner(id);
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    });
}

export function createWinner(id: number) {
  fetch(`${baseURL}${path.winners}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.getFisrtWinnerData(id)),
  })
    .then((response) => {
      if (response.status === 500) {
        getWinner(id);
      }
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    });
}

export function driveCar(id: number, status: string, controller: AbortController) {
  fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
    method: 'PATCH',
    signal: controller.signal,
  })
    .then((response) => {
      state.updatePromisesCount();
      if (response.status === 500) {
        state.setCarStatusBroken(id);
      }
      if (response.status === 200) {
        if (!state.winner && state.race) {
          state.setRaceState(false);
          state.setWinner(id);
          createWinner(id);
        }
      }
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.log(error.message);
      }
    });
}

export async function startCar(id: number, status: string, controller: AbortController) {
  try {
    const response = await fetch(`${baseURL}${path.engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    const data = await response.json();
    driveCar(id, 'drive', controller);
    state.setCarStatusDrive(id, data);
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

export function getWinners(params: Params[], page: number) {
  fetch(`${baseURL}${path.winners}${getQueryString(params)}`, {
    method: 'GET',
  })
    .then((response) => {
      const winnersCount = Number(response.headers.get('X-Total-Count'));
      state.setWinnersCount(winnersCount);
      state.setWinnersPage(page);
      return response.json();
    })
    .then((dataWinners: NewWinnerData[]) => {
      const promises = dataWinners.map((car) =>
        fetch(`${baseURL}${path.garage}/${car.id}`, {
          method: 'GET',
        }).then((response) => response.json())
      );

      Promise.all(promises).then((dataCars: CarData[]) => {
        state.setWinners(dataWinners, dataCars);
      });
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    });
}

export function updateWinner(id: number) {
  fetch(`${baseURL}${path.winners}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.getWinnerData(id)),
  }).catch((error) => {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  });
}

export function getWinner(id: number) {
  fetch(`${baseURL}${path.winners}/${id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      state.setWinnerData(data);
    })
    .then(() => {
      updateWinner(id);
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
    });
}
