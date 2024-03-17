import BaseComponent from './BaseComponent';
import appState from './AppState';
import emitter from './EventEmitter';

export default class TransaltionView extends BaseComponent {
  constructor() {
    super({ tag: 'p', classNames: ['translation'] });
    emitter.on('toggleTranslation', this.toggleVisibility);
    if (!appState.hints.translation) {
      this.addClass('hint-view-hidden');
    }
  }

  addTransaltion(rowInd: number) {
    const translText = appState.getTranslation(rowInd);
    this.setTextContent(translText);
  }

  toggleVisibility = () => {
    this.toggleClass('hint-view-hidden');
  };

  // removeVisibility = () => {
  //   this.removeClass('hint-view-hidden');
  // };
}
