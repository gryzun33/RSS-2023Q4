import BaseComponent from './BaseComponent';
import Button from './Button';
import { getWinners } from '../api';
// import { Params } from '../utils/types';
import { limitWinners } from '../utils/constants';
import state from './State';
import emitter from './EventEmitter';
import { WinnerWithCar } from '../utils/types';
import carIcon from '../utils/icons';

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
    this.getWinnersData({ page: state.winnersPage, limit: limitWinners });
    emitter.on('updateWinnersView', this.updateTableView);
  }

  protected createView() {
    const table = new BaseComponent({ tag: 'table', classNames: ['winners-table'] });
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
    // this.updateTableView({ page: state.winnersPage, limit: limitWinners });
  }

  protected updateTableView = (data: unknown) => {
    if (!Array.isArray(data)) {
      throw new Error('argument is not array');
    }
    console.log('updateview');

    data.forEach((winner: WinnerWithCar, i) => {
      const row = new BaseComponent({ tag: 'tr', classNames: ['winner-row'] });
      const numbCell = new BaseComponent({
        tag: 'th',
        classNames: ['numb-cell'],
        text: `${i + 1}`,
      });
      const iconCell = new BaseComponent({ tag: 'th', classNames: ['icon-cell'] });
      iconCell.html(carIcon(winner.color));
      const nameCell = new BaseComponent({
        tag: 'th',
        classNames: ['name-cell'],
        text: winner.name,
      });
      const winsCell = new BaseComponent({
        tag: 'th',
        classNames: ['wins-cell'],
        text: `${winner.wins}`,
      });
      const timeCell = new BaseComponent({
        tag: 'th',
        classNames: ['time-cell'],
        text: `${winner.time}`,
      });
      row.append(numbCell, iconCell, nameCell, winsCell, timeCell);
      this.tableBody.append(row);
    });

    // const winnersData = state.getWinnersData(params);
  };

  protected getWinnersData = (tableParams: TableParams) => {
    const params = Object.entries(tableParams).map(([key, value]) => ({
      key: `_${key}`,
      value: `${value}`,
    }));
    console.log('params =', params);
    getWinners();
  };
}
