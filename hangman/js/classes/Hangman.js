import { createHTMLElement } from "../utils/createHTMLElement.js";

export class Hangman {
   

  constructor(parent) {
    this.hangmanBody = [];
    this.bodyParts = ['man-head','man-body', 'man-left-arm', 'man-right-arm','man-left-leg', 'man-right-leg'];
    this.createView(parent);
    
}

  createView(parent) {
    const hangmanWrapper = createHTMLElement('div', 'hangman');
    parent.append(hangmanWrapper);
    this.bodyParts.forEach((elClass) => {
      const bodyPart = createHTMLElement('div', elClass, hangmanWrapper);
      bodyPart.classList.add('hidden');
      this.hangmanBody.push(bodyPart);
    })
    parent.append(hangmanWrapper);   
  }
}