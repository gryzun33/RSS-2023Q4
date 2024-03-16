import Select from './Select';
// import BaseComponent from './BaseComponent';
import appState from './AppState';
import emitter from './EventEmitter';

export default class RoundSelect extends Select {
  protected status: boolean[] = appState.getDoneRounds(appState.level);
  constructor(public length: number) {
    super('Round');
    this.createView();
    this.dropList.addClass('list-round');
    emitter.on('setNewLevel', this.updateView);
    emitter.on('addDoneRound', this.showDoneItem);
    this.dropList.on('click', this.onClickHandler);
  }

  protected createView(): void {
    super.createView();
    this.updateView(this.length, this.status);
  }

  protected updateView = (l: unknown, status: unknown, value: unknown = appState.round) => {
    if (typeof l !== 'number') {
      throw new Error('number of rounds is not defined');
    }

    if (!Array.isArray(status)) {
      throw new Error('status of rounds is not defined');
    }

    this.updateItemsView(l, status);
    this.setSelectValue(value);
  };

  public setSelectValue(value: unknown) {
    let selectValue: string = '';

    if (typeof value === 'number') {
      selectValue = `${value + 1}`;
    }

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
    this.toggleList();
    emitter.emit('setNewRound', true);
  };
}
