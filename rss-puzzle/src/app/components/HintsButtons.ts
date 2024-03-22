import BaseComponent from './BaseComponent';
import HintButton from './HintButton';

export default class HintButtons extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['hints-box'] });
    this.createView();
  }

  protected createView(): void {
    const imageToggler = new HintButton('hint-image', 'toggleImage', 'image');

    const translationToggler = new HintButton(
      'hint-translation',
      'toggleTranslation',
      'translation'
    );

    const soundToggler = new HintButton('hint-sound', 'toggleSound', 'sound');
    this.append(imageToggler, translationToggler, soundToggler);
  }
}
