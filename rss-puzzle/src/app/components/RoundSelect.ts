import Select from './Select';
import BaseComponent from './BaseComponent';
import appState from './AppState';
import emitter from './EventEmitter';
// import doneImg from '../../assets/icons/done.svg';

export default class RoundSelect extends Select {
  constructor(public length: number) {
    super('Round');
    this.createView();
    this.dropList.addClass('list-round');
    emitter.on('setNewLevel', this.updateView);
    this.dropList.on('click', this.onClickHandler);
  }

  protected createView(): void {
    super.createView();
    this.updateView(this.length);
  }

  protected updateView = (l: unknown, value: unknown = appState.round) => {
    console.log('length = ', l);
    if (typeof l !== 'number') {
      throw new Error('number of rounds is not defined');
    }
    // if (typeof value !== 'string') {
    //   throw new Error('value is not string');
    // }
    // console.log('thisitems=', this.items);
    this.items = [];
    this.selectMap.clear();
    this.dropList.destroyChildren();
    for (let i = 0; i < l; i += 1) {
      const item = new BaseComponent({ tag: 'li', classNames: ['select-item'] });
      const itemText = new BaseComponent({
        tag: 'span',
        classNames: ['item-text'],
        text: `${i + 1}`,
      });
      // const doneIcon = new BaseComponent({ tag: 'img', classNames: ['done-icon'] });
      // doneIcon.attr('src', doneImg);
      // doneIcon.attr('alt', 'done');
      item.append(itemText /* doneIcon */);

      this.items.push(item);
      this.dropList.append(item);
      this.selectMap.set(item.getElement(), i);
    }

    this.setSelectValue(value);
  };

  public setSelectValue(value: unknown) {
    let selectValue: string = '';

    if (typeof value === 'number') {
      selectValue = `${value + 1}`;
    }

    // if (value === '') {
    //   selectValue = '';
    // }

    // console.log('setroundvalue');

    this.mainItem.setTextContent(selectValue);
  }

  protected onClickHandler = (e: Event) => {
    const { target } = e;
    if (!(target instanceof HTMLElement)) {
      throw new Error('level list is not found');
    }

    const roundItem = target.closest('.select-item');

    if (!(roundItem instanceof HTMLElement)) {
      throw new Error('level item is not found');
    }

    const index = this.selectMap.get(roundItem);
    if (index === undefined) {
      throw new Error('index is undefined');
    }
    this.setSelectValue(index);
    appState.round = index;
    appState.row = 0;
    appState.resetState();
    // const roundsLength = appState.getNumbOfRounds();

    this.toggleList();

    emitter.emit('setNewRound', true);
  };
}
