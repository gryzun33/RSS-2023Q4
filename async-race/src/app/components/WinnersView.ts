import BaseComponent from './BaseComponent';
import Button from './Button';
// import { getWinners } from '../api';
// import { Params } from '../utils/types';
import { limitWinners } from '../utils/constants';
import state from './State';

type TableParams = {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
};
export default class WinnersView extends BaseComponent {
  public winnersTitle = new BaseComponent({ tag: 'p', classNames: ['winners-title'] });
  public pageTitle = new BaseComponent({ tag: 'p', classNames: ['page-title'] });

  public tableBody = new BaseComponent({ tag: 'tbody', classNames: ['table-body'] });

  protected winsColumn = new BaseComponent({
    tag: 'th',
    classNames: ['wins-column'],
    text: 'Wins',
  });
  protected timeColumn = new BaseComponent({
    tag: 'th',
    classNames: ['time-column'],
    text: 'Best Time',
  });

  protected prevBtn = new Button({ classNames: ['prev-btn'], text: 'prev' });
  protected nextBtn = new Button({ classNames: ['next-btn'], text: 'next' });

  constructor() {
    super({ tag: 'div', classNames: ['winners-wrapper'] });
    this.createView();
    // this.getWinnersData({ page: state.winnersPage, limit: limitWinners })
  }

  protected createView() {
    const table = new BaseComponent({ tag: 'p', classNames: ['winners-table'] });
    const tableTitle = new BaseComponent({ tag: 'tr', classNames: ['table-title'] });

    const numberColumn = new BaseComponent({ tag: 'th', classNames: ['number-column'], text: 'N' });
    const carViewColumn = new BaseComponent({
      tag: 'th',
      classNames: ['carview-column'],
      text: 'Car',
    });
    const carNameColumn = new BaseComponent({
      tag: 'th',
      classNames: ['carname-column'],
      text: 'Name',
    });

    tableTitle.append(numberColumn, carViewColumn, carNameColumn, this.winsColumn, this.timeColumn);
    table.append(tableTitle, this.tableBody);
    const pagination = new BaseComponent({ tag: 'div', classNames: ['pagination'] });
    pagination.append(this.prevBtn, this.nextBtn);
    this.append(this.winnersTitle, this.pageTitle, table, pagination);
    this.updateTableView({ page: state.winnersPage, limit: limitWinners });
  }

  protected updateTableView(tableParams: TableParams) {
    const params = Object.entries(tableParams).map(([key, value]) => ({
      key: `_${key}`,
      value: `${value}`,
    }));
    console.log('params =', params);
    // const winnersData = state.getWinnersData(params);
  }

  // protected getWinnersData =() => {

  // }
}
