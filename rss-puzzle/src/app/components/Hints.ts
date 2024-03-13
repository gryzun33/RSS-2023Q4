import BaseComponent from './BaseComponent';
import HintButton from './HintButton';

export default class Hints extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['hints-box'] });
    this.createView();
  }

  protected createView() {
    const imageToggler = new HintButton('hint-image', 'toggleImage', 'image');
    this.append(imageToggler);
  }
}
