import createHTMLElement from '../utils/createHTMLElement';
import ButtonElem from './ButtonElem';

export default class Controls {
  constructor(parent) {
    this.elem = null;
    this.createView(parent);
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'controls-wrapper', parent);

    const randomBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Random game',
      parent: this.elem,
    };
    this.randomBtn = new ButtonElem(randomBtnParams).getHTMLElement();
    console.log('randombtn=', this.randomBtn);
  }
}
