import BaseComponent from './BaseComponent';
import appState from './AppState';

export default class ResultsModal extends BaseComponent {
  public modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
  protected statistic: boolean[] = appState.getRoundStatistic();
  protected audioSrcMap = new Map<HTMLElement, string>();
  protected roundData = appState.getDataForModal();

  protected soundIcons: HTMLElement[] = [];
  constructor() {
    super({ tag: 'div', classNames: ['modal-overlay'] });
    this.createView();
    this.open();
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
      const text = new BaseComponent({
        tag: 'span',
        classNames: ['item-text'],
        text: example.text,
      });
      this.audioSrcMap.set(icon.getElement(), example.audioSrc);
      this.soundIcons.push(icon.getElement());
      item.append(icon, text);
      if (this.statistic[i]) {
        knownList.append(item);
      } else {
        unknownList.append(item);
      }
    });

    resultList.append(unknownTitle, unknownList, knownTitle, knownList);

    this.modalContent.append(title, resultList);
    this.append(this.modalContent);
    this.checkVisibilityTitle(knownTitle, unknownTitle);
  }

  protected open() {
    this.addClass('overlay-show');
    this.modalContent.addClass('modal-show');
  }

  protected close() {
    this.removeClass('overlay-show');
    this.modalContent.removeClass('modal-show');
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
}
