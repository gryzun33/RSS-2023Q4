export function getDistance(car: HTMLElement) {
  const carRect = car.getBoundingClientRect();
  const carWidth = carRect.width;
  const windowWidth = window.innerWidth;
  const rightCoordinate = windowWidth - carWidth - 40;
  const leftCoorDinate = carRect.left;
  const distance = rightCoordinate - leftCoorDinate;
  return distance;
}

export function getSeconds(duration: number) {
  return +(duration / 1000).toFixed(2);
}
