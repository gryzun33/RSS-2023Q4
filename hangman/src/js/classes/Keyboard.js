import { createHTMLElement } from '../utils/createHTMLElement.js';

export class Keyboard {
  constructor(parent) {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.keyButtons = [];
    this.createView(parent);
  }

  createView(par) {
    const keyboard = createHTMLElement('div', 'keyboard', par);

    for (let i = 0; i < this.alphabet.length; i += 1) {
      let keyLetter = this.alphabet[i];
      let keyBtn = createHTMLElement('button', 'key', keyboard);
      keyBtn.innerText = keyLetter;
      this.keyButtons.push(keyBtn);
    }
  }

  updateView() {
    this.keyButtons.forEach((btn) => {
      btn.disabled = false;
    });
  }
}
