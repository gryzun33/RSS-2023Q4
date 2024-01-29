import createHTMLElement from '../utils/createHTMLElement';
import imageModal from '../../assets/images/dale-cooper-img.png';

export default class FinishModal {
  constructor(parent) {
    this.createView(parent);
  }

  createView(parent) {
    this.overlay = createHTMLElement('div', 'overlay modal-hidden', parent);
    this.modalWrapper = createHTMLElement('div', 'modal-wrapper', this.overlay);
    // this.overlay.classList.add('modal-hidden');
    this.closeBtn = createHTMLElement('button', 'close-btn', this.modalWrapper);
    // this.gameTime = createHTMLElement('span', 'game-time');
    this.content = createHTMLElement('div', 'modal-content', this.modalWrapper);

    this.modalImage = createHTMLElement('img', 'modal-image', this.content);
    this.modalImage.src = imageModal;

    this.endBtn = createHTMLElement('button', 'end-btn', this.modalWrapper, 'OK');

    this.events();
  }

  updateContent(time) {
    // this.content.innerHTML = '';
    if (this.finishText) {
      this.finishText.remove();
    }

    this.finishText = createHTMLElement('p', 'finish-text', this.content);
    this.finishText.innerHTML = `Great! You have solved the nonogram in <span>${time}</span> seconds!`;
  }

  showModal(value) {
    this.updateContent(value);
    this.overlay.classList.remove('modal-hidden');
    this.overlay.classList.add('overlay-show');
    this.modalWrapper.classList.add('modal-show');
  }

  closeModal() {
    function animationEndHandler() {
      this.classList.add('modal-hidden');
      this.classList.remove('overlay-show', 'overlay-hide');
      this.firstElementChild.classList.remove('modal-show', 'modal-hide');
      this.removeEventListener('animationend', animationEndHandler);
    }

    this.modalWrapper.classList.add('modal-hide');
    this.overlay.classList.add('overlay-hide');
    this.overlay.addEventListener('animationend', animationEndHandler);
  }

  events() {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay || e.target === this.closeBtn || e.target === this.endBtn) {
        console.log('closemodal');
        this.closeModal();
      }
    });
  }
}
