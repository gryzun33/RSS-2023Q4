import createHTMLElement from '../utils/createHTMLElement.js';

export default class Keyboard {
  constructor(parent) {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.keyButtons = [];
    this.createView(parent);
  }

  createView(par) {
    const keyboardElem = createHTMLElement('div', 'keyboard', par);

    for (let i = 0; i < this.alphabet.length; i += 1) {
      const keyLetter = this.alphabet[i];
      const keyBtn = createHTMLElement('button', 'key', keyboardElem);
      keyBtn.innerText = keyLetter;
      keyBtn.id = keyLetter;
      this.keyButtons.push(keyBtn);
    }
  }

  updateView() {
    this.keyButtons.forEach((btn) => {
      const btnCurr = btn;
      btnCurr.disabled = false;
    });
  }
}
