import createHTMLElement from '../utils/createHTMLElement';
import imageModal from '../../assets/images/dale-cooper-img.png';
import Modal from './Modal';

export default class FinishModal extends Modal {
  constructor(parent, sound) {
    super(parent);
    // ???????
    this.parent = parent;
    this.sound = sound;
    this.onCloseHandler();
  }

  createContent() {
    this.content = createHTMLElement('div', 'finish-modal-content', this.modalWrapper);
    // this.content.classList.add('finish-modal-content');
    this.modalImage = createHTMLElement('img', 'finish-modal-image', this.content);
    this.modalImage.src = imageModal;
  }

  updateContent(time) {
    // this.content.innerHTML = '';
    if (this.finishText) {
      this.finishText.remove();
    }

    this.finishText = createHTMLElement('p', 'finish-text', this.content);
    this.finishText.innerHTML = `Great! You have solved the nonogram in <span>${time}</span> seconds!`;
  }

  onCloseHandler() {
    console.log('closehandler');
    this.overlay.addEventListener('click', (e) => {
      console.log('addiitonal click');
      if (e.target === this.overlay || e.target === this.closeBtn || e.target === this.endBtn) {
        this.sound.pause();
      }
    });
  }
}
