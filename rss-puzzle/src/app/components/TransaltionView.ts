import BaseComponent from './BaseComponent';
import appState from './AppState';
import emitter from './EventEmitter';

export default class TransaltionView extends BaseComponent {
  constructor() {
    super({ tag: 'p', classNames: ['translation', 'hint-view-hidden'] });
    emitter.on('toggleTranslation', this.toggleVisibility);
  }

  addTransaltion() {
    const translText = appState.getTranslation();
    this.setTextContent(translText);
  }

  toggleVisibility = () => {
    this.toggleClass('hint-view-hidden');
  };

  removeVisibility = () => {
    this.removeClass('hint-view-hidden');
  };
}
