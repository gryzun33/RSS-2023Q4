export default function getDistance(car: HTMLElement) {
  const carRect = car.getBoundingClientRect();
  const carWidth = carRect.width;
  const windowWidth = window.innerWidth;
  const rightCoordinate = windowWidth - carWidth - 40;
  console.log('right=', rightCoordinate);
  const leftCoorDinate = carRect.left;
  const distance = rightCoordinate - leftCoorDinate;
  return distance;
}
