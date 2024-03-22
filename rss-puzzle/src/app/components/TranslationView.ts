import BaseComponent from './BaseComponent';
import appState from './AppState';
import emitter from './EventEmitter';

export default class TranslationView extends BaseComponent {
  constructor() {
    super({ tag: 'p', classNames: ['translation'] });
    emitter.on('toggleTranslation', this.toggleVisibility);
    if (!appState.hints.translation) {
      this.addClass('hint-view-hidden');
    }
  }

  public addTransaltion(rowInd: number): void {
    const translText = appState.getTranslation(rowInd);
    this.setTextContent(translText);
  }

  protected toggleVisibility = (): void => {
    this.toggleClass('hint-view-hidden');
  };
}
