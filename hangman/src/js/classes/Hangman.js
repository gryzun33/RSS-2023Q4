import createHTMLElement from '../utils/createHTMLElement.js';

export default class Hangman {
  constructor(parent) {
    this.hangmanBody = [];
    this.bodyParts = [
      {
        cssClass: 'man-head',
        src: './src/assets/images/head.png',
      },
      {
        cssClass: 'man-body',
        src: './src/assets/images/body.png',
      },
      {
        cssClass: 'man-left-arm',
        src: './src/assets/images/left-arm.png',
      },
      {
        cssClass: 'man-right-arm',
        src: './src/assets/images/right-arm.png',
      },
      {
        cssClass: 'man-left-leg',
        src: './src/assets/images/left-leg.png',
      },
      {
        cssClass: 'man-right-leg',
        src: './src/assets/images/right-leg.png',
      },
      {
        cssClass: 'halo',
        src: './src/assets/images/halo.png',
      },
    ];
    this.createView(parent);
  }

  createView(par) {
    const gallows = createHTMLElement('img', 'gallows', par);
    const hangmanWrapper = createHTMLElement('div', 'hangman', par);
    gallows.src = './src/assets/images/gallows.png';

    this.bodyParts.forEach((part) => {
      const bodyPart = createHTMLElement('img', part.cssClass, hangmanWrapper);
      bodyPart.src = part.src;
      bodyPart.classList.add('hidden', 'body-part');
      this.hangmanBody.push(bodyPart);
    });
  }

  addNextPart(ind) {
    this.hangmanBody[ind].classList.remove('hidden');
  }

  addHalo() {
    this.hangmanBody[6].classList.remove('hidden');
    this.hangmanBody[6].classList.add('halo-show');
  }

  hideMan() {
    this.hangmanBody.forEach((part) => {
      part.classList.add('hidden');
    });
    this.hangmanBody[6].classList.remove('halo-show');
  }
}
