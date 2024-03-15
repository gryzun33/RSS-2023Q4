import appState from './AppState';
import emitter from './EventEmitter';
import Select from './Select';
import BaseComponent from './BaseComponent';

export default class LevelSelect extends Select {
  constructor(public length: number) {
    super('Level');
    this.createView();
    this.dropList.addClass('list-level');
    this.dropList.on('click', this.onClickHandler);
  }

  protected createView(): void {
    super.createView();
    this.updateView(this.length);
  }

  protected updateView(l: number) {
    this.items = [];
    this.selectMap.clear();
    this.dropList.destroyChildren();
    for (let i = 0; i < l; i += 1) {
      const item = new BaseComponent({ tag: 'li', classNames: ['select-item'], text: `${i + 1}` });
      this.items.push(item);
      this.dropList.append(item);
      this.selectMap.set(item.getElement(), i);
    }
    this.setSelectValue();
  }

  // protected updateView(): void {
  //   super.updateView(this.length);
  //   this.setSelectValue();
  // }

  public setSelectValue(value: number = appState.level) {
    console.log('setlevelvalue');
    this.mainItem.setTextContent(`${value + 1}`);
  }

  protected onClickHandler = (e: Event) => {
    const { target } = e;
    if (!(target instanceof HTMLElement)) {
      throw new Error('level list is not found');
    }

    const levelItem = target.closest('.select-item');

    if (!(levelItem instanceof HTMLElement)) {
      throw new Error('level item is not found');
    }

    const index = this.selectMap.get(levelItem);
    if (index === undefined) {
      throw new Error('index is undefined');
    }
    this.setSelectValue(index);
    appState.level = index;
    const roundsLength = appState.getNumbOfRounds();

    this.toggleList();
    emitter.emit('setNewLevel', roundsLength, '');
  };
}
