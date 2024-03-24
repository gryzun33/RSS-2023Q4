import BaseComponent from '../BaseComponent';

export class CarView extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['car-box'] });
  }
}
