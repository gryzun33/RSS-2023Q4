import BaseComponent from './BaseComponent';
import { numbRows } from '../utils/constants';

export default class RowsIconsBox extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['rows-icons-box'] });
    this.createView();
  }

  protected createView(): void {
    for (let i = 0; i < numbRows; i += 1) {
      const rowIconWrapper = new BaseComponent({ tag: 'div', classNames: ['row-icon-wrapper'] });
      const rowIcon = new BaseComponent({
        tag: 'div',
        classNames: ['row-icon'],
        text: `${i + 1}`,
      });
      rowIconWrapper.append(rowIcon);
      this.append(rowIconWrapper);
    }
  }
}
