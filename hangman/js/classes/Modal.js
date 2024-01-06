import { createHTMLElement } from "../utils/createHTMLElement.js";

export class Modal {
  constructor(parent) {
    this.playBtn = null;
    this.createView(parent);
  }

  createView(parent) {
    this.modalWrapper = createHTMLElement('div','modal-wrapper', parent);
    this.modalWrapper.classList.add('modal-hidden');
    // this.modalContainer = createHTMLElement('div','modal-container', modalWrapper);
    
    this.modalTitle = createHTMLElement('h2','modal-title', this.modalWrapper);
    // const modalContent = createHTMLElement('div','modal-content',  this.modalWrapper);
    const modalAnswer = createHTMLElement('div','modal-answer', this.modalWrapper);
    const modalAnswerTitle = createHTMLElement('p','answer-title', modalAnswer);
    modalAnswerTitle.innerText = 'Secret word:'
    this.modalCorrectAnswer = createHTMLElement('p','correct-answer', modalAnswer);
    this.playBtn = createHTMLElement('button','play-btn', this.modalWrapper);
    this.playBtn.innerText = 'PLAY AGAIN';
  }

  showModal(result, answer) { {
    if(result === 'win') {
      this.modalTitle.innerText = `Cool!  You saved Kenny's life!`;
    }
    if(result === 'fail') {
      this.modalTitle.innerText = `Oh my God!  You killed Kenny!`;
    }
    this.modalCorrectAnswer.innerText = answer;

    this.modalWrapper.classList.remove('modal-hidden');
    this.modalWrapper.classList.add('modal-wrapper-show');
    // this.modalContainer.classList.add('modal-container-show');
    
    
  }

  }

}