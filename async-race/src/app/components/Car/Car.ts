import BaseComponent from '../BaseComponent';

export class Car extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['car-box'] });
  }
}
