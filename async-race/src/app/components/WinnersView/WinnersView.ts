import styles from './winnersview.module.scss';
import BaseComponent from '../utilsComponents/BaseComponent';
import Button from '../utilsComponents/Button';
import { getWinners } from '../api';
import { limitWinners } from '../../utils/constants';
import state from '../State';
import emitter from '../EventEmitter';
import { WinnerWithCar, SortState, OrderState } from '../../utils/types';
import carIcon from '../../utils/icons';

type TableParams = {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
};
export default class WinnersView extends BaseComponent {
  public winnersTitle = new BaseComponent({ tag: 'p', classNames: [styles.winnersTitle] });
  public pageTitle = new BaseComponent({ tag: 'p', classNames: [styles.pageTitle] });
  public tableBody = new BaseComponent({ tag: 'tbody', classNames: [styles.tableBody] });

  protected winsColumn = new BaseComponent({
    tag: 'th',
    classNames: [styles.winsColumn],
    text: 'Wins',
  });
  protected timeColumn = new BaseComponent({
    tag: 'th',
    classNames: [styles.timeColumn],
    text: 'Best time,s',
  });

  private ColumnMap = new Map([
    [SortState.wins, this.winsColumn],
    [SortState.time, this.timeColumn],
  ]);

  protected prevBtn = new Button({ classNames: [styles.prevBtn] });
  protected nextBtn = new Button({ classNames: [styles.nextBtn] });

  constructor() {
    super({ tag: 'div', classNames: [styles.winnersWrapper] });
    this.createView();
    this.getWinnersData({
      page: state.winnersPage,
      limit: limitWinners,
      sort: state.sort,
      order: state.order,
    });
    emitter.on('updateWinnersView', this.updateTableView);
    emitter.on('updateWinnersCount', this.updateWinnersTitle);
    emitter.on('updateWinnersPage', this.updateWinnersPage);
    this.prevBtn.on('click', this.onClickPrevBtn);
    this.nextBtn.on('click', this.onClickNextBtn);
    this.winsColumn.on('click', this.onClickWinsSort);
    this.timeColumn.on('click', this.onClickTimeSort);
  }

  protected createView() {
    const table = new BaseComponent({ tag: 'table', classNames: [styles.winnersTable] });
    const tableTitle = new BaseComponent({ tag: 'tr', classNames: [styles.tableHeader] });

    const numberColumn = new BaseComponent({
      tag: 'th',
      classNames: [styles.numberColumn],
      text: 'N',
    });
    const carViewColumn = new BaseComponent({
      tag: 'th',
      classNames: [styles.carviewColumn],
      text: 'Car',
    });
    const carNameColumn = new BaseComponent({
      tag: 'th',
      classNames: [styles.carnameColumn],
      text: 'Name',
    });

    tableTitle.append(numberColumn, carViewColumn, carNameColumn, this.winsColumn, this.timeColumn);
    table.append(tableTitle, this.tableBody);
    const pagination = new BaseComponent({ tag: 'div', classNames: [styles.pagination] });
    pagination.append(this.prevBtn, this.pageTitle, this.nextBtn);
    this.append(this.winnersTitle, table, pagination);
    this.checkSortedTable();
  }

  private sorting(column: SortState, order: OrderState) {
    const col = this.ColumnMap.get(column);
    if (!col) {
      throw new Error(`col is undefined`);
    }
    const orderClass = order === OrderState.up ? styles.arrowUp : styles.arrowDown;
    col.addClass(orderClass);
  }

  protected checkSortedTable() {
    const sortedField = state.getSortValue();
    const orderField = state.getOrderValue();

    this.sorting(sortedField, orderField);
  }
  protected updateTableView = (data: unknown, page: unknown) => {
    if (!Array.isArray(data)) {
      throw new Error('argument is not array');
    }

    if (typeof page !== 'number') {
      throw new Error('page is not number');
    }
    if (this.tableBody.children) {
      this.tableBody.destroyChildren();
    }

    data.forEach((winner: WinnerWithCar, i) => {
      const row = new BaseComponent({ tag: 'tr', classNames: ['winner-row'] });
      const numbCell = new BaseComponent({
        tag: 'td',
        classNames: ['numb-cell'],
        text: `${i + 1 + (page - 1) * 10}`,
      });
      const iconCell = new BaseComponent({ tag: 'td', classNames: [styles.iconCell] });
      iconCell.html(carIcon(winner.color));
      const nameCell = new BaseComponent({
        tag: 'td',
        classNames: ['name-cell'],
        text: winner.name,
      });
      const winsCell = new BaseComponent({
        tag: 'td',
        classNames: ['wins-cell'],
        text: `${winner.wins}`,
      });
      const timeCell = new BaseComponent({
        tag: 'td',
        classNames: ['time-cell'],
        text: `${winner.time}`,
      });
      row.append(numbCell, iconCell, nameCell, winsCell, timeCell);
      this.tableBody.append(row);
    });
  };

  protected getWinnersData = (tableParams: TableParams) => {
    const params = Object.entries(tableParams)
      .map(([key, value]) => ({
        key: `_${key}`,
        value: `${value}`,
      }))
      .filter((el) => el.value !== '');

    getWinners(params, tableParams.page);
  };

  protected updateWinnersTitle = (count: unknown) => {
    this.winnersTitle.setTextContent(`Winners (${count})`);
  };

  protected updateWinnersPage = (page: unknown, prevBtnState: unknown, nextBtnState: unknown) => {
    if (typeof page !== 'number') {
      throw new Error('count is not number');
    }
    if (typeof prevBtnState !== 'boolean' || typeof nextBtnState !== 'boolean') {
      throw new Error('state of pagination is not boolean');
    }
    this.pageTitle.setTextContent(`${page}`);
    this.prevBtn.element.disabled = !prevBtnState;
    this.nextBtn.element.disabled = !nextBtnState;
  };

  protected onClickPrevBtn = () => {
    this.getWinnersData({
      page: state.winnersPage - 1,
      limit: limitWinners,
      sort: state.sort,
      order: state.order,
    });
  };

  protected onClickNextBtn = () => {
    this.getWinnersData({
      page: state.winnersPage + 1,
      limit: limitWinners,
      sort: state.sort,
      order: state.order,
    });
  };

  public onClickWinsSort = () => {
    const order = state.order === OrderState.up ? OrderState.down : OrderState.up;
    this.getWinnersData({
      page: state.winnersPage,
      limit: limitWinners,
      sort: SortState.wins,
      order,
    });

    const classCss = order === OrderState.up ? styles.arrowUp : styles.arrowDown;
    let prevClass: string = '';
    if (state.order) {
      prevClass = state.order === OrderState.up ? styles.arrowUp : styles.arrowDown;
      this.winsColumn.removeClass(prevClass);
    }
    this.winsColumn.addClass(classCss);
    this.timeColumn.removeClass(styles.arrowUp);
    this.timeColumn.removeClass(styles.arrowDown);
    state.setOrderAndSortState(SortState.wins, order);
  };

  public onClickTimeSort = () => {
    const order = state.order === OrderState.up ? OrderState.down : OrderState.up;
    this.getWinnersData({
      page: state.winnersPage,
      limit: limitWinners,
      sort: SortState.time,
      order,
    });

    const classCss = order === OrderState.up ? styles.arrowUp : styles.arrowDown;
    let prevClass: string = '';
    if (state.order) {
      prevClass = state.order === OrderState.up ? styles.arrowUp : styles.arrowDown;
      this.timeColumn.removeClass(prevClass);
    }

    this.timeColumn.addClass(classCss);
    this.winsColumn.removeClass(styles.arrowUp);
    this.winsColumn.removeClass(styles.arrowDown);
    state.setOrderAndSortState(SortState.time, order);
  };
}
