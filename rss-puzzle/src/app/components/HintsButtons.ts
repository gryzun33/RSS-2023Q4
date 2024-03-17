import BaseComponent from './BaseComponent';
import HintButton from './HintButton';

export default class HintButtons extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['hints-box'] });
    this.createView();
  }

  protected createView() {
    const imageToggler = new HintButton('hint-image', 'toggleImage', 'image');
    this.append(imageToggler);

    const imageTranslation = new HintButton('hint-translation', 'toggleTranslation', 'translation');
    this.append(imageTranslation);
  }
}
