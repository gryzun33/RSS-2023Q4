import createHTMLElement from '../utils/createHTMLElement';

export default class Modal {
  constructor(parent) {
    this.createView(parent);
  }

  createView(parent) {
    this.overlay = createHTMLElement('div', 'overlay modal-hidden', parent);
    this.modalWrapper = createHTMLElement('div', 'modal-wrapper', this.overlay);
    this.closeBtn = createHTMLElement('button', 'close-btn', this.modalWrapper);
    this.createContent();
    this.endBtn = createHTMLElement('button', 'end-btn', this.modalWrapper, 'OK');
    this.events();
  }

  createContent() {
    this.content = createHTMLElement('div', 'modal-content', this.modalWrapper);
  }

  updateContent(value) {
    this.value = value;
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
        this.closeModal();
      }
    });
  }
}
