// import appState from './AppState';
import BaseComponent from './BaseComponent';

export default class Select extends BaseComponent {
  public items: BaseComponent[] = [];

  public selectMap: Map<HTMLElement, number> = new Map();
  public mainItem = new BaseComponent({ tag: 'div', classNames: ['select-main'] });
  public dropList = new BaseComponent({ tag: 'ul', classNames: ['select-list'] });
  constructor(protected label: string) {
    super({ tag: 'div', classNames: ['select-box'] });
    // this.createView();
    this.mainItem.on('click', this.toggleList);
  }

  protected createView(): void {
    const label = new BaseComponent({ tag: 'div', classNames: ['select-label'], text: this.label });
    const contentWrapper = new BaseComponent({ tag: 'div', classNames: ['select-wrapper'] });
    contentWrapper.append(this.mainItem, this.dropList);
    this.append(label, contentWrapper);
    // this.updateView(l);
  }

  // protected updateView(l: number) {
  //   this.items = [];
  //   this.selectMap.clear();
  //   this.dropList.destroyChildren();
  //   for (let i = 0; i < l; i += 1) {
  //     const item = new BaseComponent({ tag: 'li', classNames: ['select-item'], text: `${i + 1}` });
  //     this.items.push(item);
  //     this.dropList.append(item);
  //     this.selectMap.set(item.getElement(), i);
  //   }
  // }

  protected toggleList = (): void => {
    this.dropList.toggleClass('open-list');
  };
}
