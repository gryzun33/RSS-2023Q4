import appState from './AppState';
import emitter from './EventEmitter';
import Select from './Select';
// import BaseComponent from './BaseComponent';

export default class LevelSelect extends Select {
  protected status = appState.getDoneLevels();
  constructor(public length: number) {
    super('Level');
    this.createView();
    this.dropList.addClass('list-level');
    this.dropList.on('click', this.onClickHandler);
    emitter.on('addlevelRound', this.showDoneItem);
  }

  protected createView(): void {
    super.createView();
    this.updateView(this.length, this.status);
  }

  protected updateView(l: number, status: boolean[]) {
    this.updateItemsView(l, status);
    this.setSelectValue();
  }

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
    const statusRounds = appState.getDoneRounds(index);
    const roundsLength = appState.getNumbOfRounds();

    this.toggleList();
    emitter.emit('setNewLevel', roundsLength, statusRounds, '');
  };
}
