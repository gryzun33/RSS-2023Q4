import { createHTMLElement } from "../utils/createHTMLElement.js";

export class Modal {
  constructor(parent) {
    this.playBtn = null;
    this.createView(parent);
  }

  createView(parent) {
    this.overlay = createHTMLElement('div', 'overlay', parent);
    this.modalWrapper = createHTMLElement('div','modal-wrapper', this.overlay);
    this.overlay.classList.add('modal-hidden');
    // this.modalContainer = createHTMLElement('div','modal-container', modalWrapper);
    
    this.modalTitle = createHTMLElement('h2','modal-title', this.modalWrapper);
    this.modalContent = createHTMLElement('div','modal-content',  this.modalWrapper);
    this.modalImageBox = createHTMLElement('div','modal-image-box',  this.modalContent);
    this.modalImage = createHTMLElement('div','modal-image',  this.modalImageBox);
    this.manModal = createHTMLElement('img', 'man-modal', this.modalImage);
    this.haloModal = createHTMLElement('img', 'halo-modal', this.modalImage);
    this.manModal.src = './assets/images/kenny-modal.png';
    this.haloModal.src = './assets/images/halo-modal.png';
    // bodyPart.classList.add('hidden', 'body-part');
    const modalAnswer = createHTMLElement('div','modal-answer', this.modalContent);
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
      this.haloModal.classList.add('halo-modal-show');
    }
    this.modalCorrectAnswer.innerText = answer;

    this.overlay.classList.remove('modal-hidden');
    this.overlay.classList.add('overlay-show');
    this.modalWrapper.classList.add('modal-show');
    // this.modalContainer.classList.add('modal-container-show');
    
    
  }

  }

  closeModal() {
    this.modalWrapper.classList.add('modal-hide');
    this.overlay.classList.add('overlay-hide');
    this.haloModal.classList.remove('halo-modal-show');
    this.overlay.addEventListener('animationend', animationEndHandler);
    
    
   function animationEndHandler() {
      this.classList.add('modal-hidden');
      this.classList.remove('overlay-show', 'overlay-hide');
      this.firstElementChild.classList.remove('modal-show', 'modal-hide');
      this.removeEventListener('animationend', animationEndHandler);
    }
  
  }

 

}