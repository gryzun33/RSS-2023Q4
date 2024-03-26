export default function getDistance(car: HTMLElement) {
  const carRect = car.getBoundingClientRect();
  const carWidth = carRect.width;
  const windowWidth = window.innerWidth; // Ширина окна браузера
  const rightCoordinate = windowWidth - carWidth - 40;
  const leftCoorDinate = carRect.left;
  const distance = rightCoordinate - leftCoorDinate;
  return distance;
}
