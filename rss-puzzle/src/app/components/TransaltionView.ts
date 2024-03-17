import BaseComponent from './BaseComponent';
import appState from './AppState';

export default class TransaltionView extends BaseComponent {
  constructor() {
    super({ tag: 'p', classNames: ['translation'] });
    // this.updateView()
  }

  addTransaltion() {
    const translText = appState.getTranslation();
    this.setTextContent(translText);
  }

  toggleVisibility = () => {
    this.toggleClass('translation-hidden');
  };

  removeVisibility = () => {
    this.removeClass('translation-hidden');
  };
}
