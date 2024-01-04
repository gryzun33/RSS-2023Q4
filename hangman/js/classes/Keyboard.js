import { createHTMLElement } from "../utils/createHTMLElement.js";

export class Keyboard {

  constructor(parent) {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.keyButtons = {};
    this.createView(parent);
  }

  createView(par) {
    
    for(let i = 0; i < this.alphabet.length; i+=1) {
      let keyLetter = this.alphabet[i];
      let keyElem = createHTMLElement('button', 'key', par);
      keyElem.innerText = keyLetter;
      // keyElem.dataset.letter = keyLetter;
      this.keyButtons[keyLetter] = keyElem;
    }
  }


}