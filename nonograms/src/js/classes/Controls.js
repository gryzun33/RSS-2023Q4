import createHTMLElement from '../utils/createHTMLElement';
import ButtonElem from './ButtonElem';

export default class Controls {
  constructor(parent, startRandomGame) {
    this.elem = null;
    this.randomBtn = null;

    this.startRandomGame = startRandomGame;

    this.createView(parent);
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'controls-wrapper', parent);

    const randomBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Random game',
      parent: this.elem,
      callback: this.startRandomGame,
    };
    this.randomBtn = new ButtonElem(randomBtnParams);

    console.log('randombtn=', this.randomBtn);
  }
}
