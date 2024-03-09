import BaseComponent from './BaseComponent';

export default class Row extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['row'] });
    // this.createView();
  }
}
