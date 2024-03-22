import BaseComponent from './BaseComponent';
import Button from './Button';
import appState from './AppState';
import { СallbackFunc } from '../utils/types';

export default class ResultsModal extends BaseComponent {
  public modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
  protected statistic: boolean[] = appState.getRoundStatistic();
  protected roundExamples = appState.getDataForModal();

  protected roundData = appState.getRoundDataForModal();
  protected audio = new Audio();
  protected nextStep: СallbackFunc;

  constructor(nextStep: СallbackFunc) {
    super({ tag: 'div', classNames: ['modal-overlay'] });
    this.createView();
    this.open();
    this.nextStep = nextStep;
  }

  protected createView(): void {
    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', classNames: ['image-modal'] });
    img.attr('src', `${this.roundData.fullcutSrc}`);
    img.attr('alt', `${this.roundData.name}`);
    const text = `${this.roundData.author} - ${this.roundData.name}, ${this.roundData.year}`;
    const description = new BaseComponent({ tag: 'p', classNames: ['modal-text'], text });

    const resultList = new BaseComponent({ tag: 'div', classNames: ['result-list'] });
    const unknownTitle = new BaseComponent({
      tag: 'p',
      classNames: ['unknown-title'],
      text: `I dont't know`,
    });
    const knownTitle = new BaseComponent({ tag: 'p', classNames: ['known-title'], text: `I know` });
    const unknownList = new BaseComponent({ tag: 'ul', classNames: ['known-list'] });
    const knownList = new BaseComponent({ tag: 'ul', classNames: ['unknown-list'] });

    this.roundExamples.forEach((example, i) => {
      const item = new BaseComponent({ tag: 'li', classNames: ['list-item'] });
      const icon = new BaseComponent({ tag: 'button', classNames: ['sound-modal'] });
      icon.on('click', () => {
        this.audio.src = example.audioSrc;
        this.audio.play();
      });
      const answer = new BaseComponent({
        tag: 'span',
        classNames: ['item-text'],
        text: example.text,
      });
      item.append(icon, answer);
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
    this.modalContent.append(img, description, resultList, continueBtn);
    this.append(this.modalContent);
    this.checkVisibilityTitle(knownTitle, unknownTitle);
  }

  protected open(): void {
    this.addClass('overlay-show');
    this.modalContent.addClass('modal-show');
  }

  protected close(): void {
    this.addClass('overlay-hide');
    this.modalContent.addClass('modal-hide');
    this.modalContent.on('animationend', () => {
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

  protected onClickContinueBtn = (): void => {
    this.close();
    this.nextStep();
  };
}
