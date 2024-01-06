import { createHTMLElement } from "../utils/createHTMLElement.js";

export class Hangman {
   

  constructor(parent) {
    this.hangmanBody = [];
    this.bodyParts = [
      {
        cssClass: 'man-head',
        src: './assets/images/head.png'
      },
      {
        cssClass: 'man-body',
        src: './assets/images/body.png'
      },
      {
        cssClass: 'man-left-arm',
        src: './assets/images/left-arm.png'
      },
      {
        cssClass: 'man-right-arm',
        src: './assets/images/right-arm.png'
      },
      {
        cssClass: 'man-left-leg',
        src: './assets/images/left-leg.png'
      },
      {
        cssClass: 'man-right-leg',
        src: './assets/images/right-leg.png'
      },
      {
        cssClass: 'halo',
        src: './assets/images/halo.png'
      }
    ];
    this.createView(parent);
    
}

  createView(par) {
    const gallows = createHTMLElement('img', 'gallows', par);
    const hangmanWrapper = createHTMLElement('div', 'hangman', par);
    gallows.src='./assets/images/gallows.png';
    // parent.append(hangmanWrapper);
    this.bodyParts.forEach((part) => {
      const bodyPart = createHTMLElement('img', part.cssClass, hangmanWrapper);
      bodyPart.src = part.src;
      bodyPart.classList.add('hidden', 'body-part');
      this.hangmanBody.push(bodyPart);
    })
    // parent.append(hangmanWrapper);   
  }

  addNextPart(ind) {
    this.hangmanBody[ind].classList.remove('hidden');
  }

  addHalo() {
    // this.hangmanBody[6].classList.remove('hidden');
    this.hangmanBody[6].classList.add('halo-show');
  }

  hideMan() {
    this.bodyParts.forEach((part) => {      
      part.classList.add('hidden');
    })
  }

  
}