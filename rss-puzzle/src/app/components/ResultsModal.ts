import BaseComponent from './BaseComponent';
import Button from './Button';
import appState from './AppState';
// import { CallbackFunc } from '../utils/types';

export default class ResultsModal extends BaseComponent {
  public modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
  protected statistic: boolean[] = appState.getRoundStatistic();
  protected roundData = appState.getDataForModal();

  protected audio = new Audio();
  protected nextStep: () => void;

  constructor(nextStep: () => void) {
    super({ tag: 'div', classNames: ['modal-overlay'] });
    this.createView();
    this.open();
    this.nextStep = nextStep;
    // this.soundIcons.forEach((icon) => icon.on('click', this.playSound))
  }

  protected createView() {
    const title = new BaseComponent({ tag: 'h2', classNames: ['modal-title'], text: 'Results' });

    const resultList = new BaseComponent({ tag: 'div', classNames: ['result-list'] });
    const unknownTitle = new BaseComponent({
      tag: 'p',
      classNames: ['unknown-title'],
      text: `I dont't know`,
    });
    const knownTitle = new BaseComponent({ tag: 'p', classNames: ['known-title'], text: `I know` });
    const unknownList = new BaseComponent({ tag: 'ul', classNames: ['known-list'] });
    const knownList = new BaseComponent({ tag: 'ul', classNames: ['unknown-list'] });

    this.roundData.forEach((example, i) => {
      const item = new BaseComponent({ tag: 'li', classNames: ['list-item'] });
      const icon = new BaseComponent({ tag: 'button', classNames: ['sound-modal'] });
      icon.on('click', () => {
        this.audio.src = example.audioSrc;
        this.audio.play();
      });
      const text = new BaseComponent({
        tag: 'span',
        classNames: ['item-text'],
        text: example.text,
      });
      item.append(icon, text);
      if (this.statistic[i]) {
        knownList.append(item);
      } else {
        unknownList.append(item);
      }
    });

    const continueBtn = new Button({
      classNames: ['continue-btn-modal'],
      text: 'Continue',
      callback: this.onClickContinueBtn,
    });

    resultList.append(unknownTitle, unknownList, knownTitle, knownList);
    this.modalContent.append(title, resultList, continueBtn);
    this.append(this.modalContent);
    this.checkVisibilityTitle(knownTitle, unknownTitle);
  }

  protected open() {
    this.addClass('overlay-show');
    this.modalContent.addClass('modal-show');
  }

  protected close() {
    this.addClass('overlay-hide');
    this.modalContent.addClass('modal-hide');
    this.modalContent.on('animationend', () => {
      console.log('thisModal = ', this);
      this.destroy();
    });
  }

  protected checkVisibilityTitle(knownTitle: BaseComponent, unknownTitle: BaseComponent) {
    if (this.statistic.every((el) => el === false)) {
      knownTitle.addClass('title-hidden');
    } else if (this.statistic.every((el) => el === true)) {
      unknownTitle.addClass('title-hidden');
    }
  }

  protected onClickContinueBtn = () => {
    this.close();
    this.nextStep();
  };

  // protected playSound = (e: Event) => {
  //   if (!e.target || !(e.target instanceof HTMLElement)) {
  //     throw new Error();
  //   }

  //   const icon = e.target.closest('sound-modal');
  //   this.audio.src =
  // };
}
