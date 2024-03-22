import BaseComponent from './BaseComponent';
import doneImg from '../../assets/icons/done.svg';

export default class Select extends BaseComponent {
  public items: BaseComponent[] = [];

  public selectMap: Map<HTMLElement, number> = new Map();
  public mainItem = new BaseComponent({ tag: 'div', classNames: ['select-main'] });
  public dropList = new BaseComponent({ tag: 'ul', classNames: ['select-list'] });
  constructor(protected label: string) {
    super({ tag: 'div', classNames: ['select-box'] });
    this.mainItem.on('click', this.toggleList);
  }

  protected createView(): void {
    const label = new BaseComponent({ tag: 'div', classNames: ['select-label'], text: this.label });
    const contentWrapper = new BaseComponent({ tag: 'div', classNames: ['select-wrapper'] });
    contentWrapper.append(this.mainItem, this.dropList);
    this.append(label, contentWrapper);
  }

  protected updateItemsView(l: number, status: boolean[]): void {
    this.items = [];
    this.selectMap.clear();
    this.dropList.destroyChildren();
    for (let i = 0; i < l; i += 1) {
      const item = new BaseComponent({ tag: 'li', classNames: ['select-item'] });
      if (status[i]) {
        item.addClass('select-item-done');
      }
      const itemText = new BaseComponent({
        tag: 'span',
        classNames: ['item-text'],
        text: `${i + 1}`,
      });
      const doneIcon = new BaseComponent({
        tag: 'img',
        classNames: ['done-icon', 'done-icon-visible'],
      });
      doneIcon.attr('src', doneImg);
      doneIcon.attr('alt', 'done');
      item.append(itemText, doneIcon);

      this.items.push(item);
      this.dropList.append(item);
      this.selectMap.set(item.getElement(), i);
    }
  }

  protected toggleList = (): void => {
    this.dropList.toggleClass('open-list');
  };

  protected showDoneItem = (ind: unknown) => {
    if (typeof ind !== 'number') {
      throw new Error('index is not a number');
    }
    this.items[ind].addClass('select-item-done');
  };
}
