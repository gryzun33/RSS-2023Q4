import styles from './app.module.scss';
import Button from '../utilsComponents/Button';
import BaseComponent from '../utilsComponents/BaseComponent';
import GarageView from '../GarageView/GarageView';
import WinnersView from '../WinnersView/WinnersView';
import state from '../State';

export default class App {
  protected root = new BaseComponent({ tag: 'div', classNames: [styles.wrapper] });
  protected garageBtn = new Button({
    classNames: [styles.garageBtn],
    text: 'to Garage',
  });

  public winnersBtn = new Button({
    classNames: [styles.winnersBtn],
    text: 'to Winners',
  });

  protected garageView?: GarageView;
  protected winnersView?: WinnersView;

  constructor() {
    this.garageBtn.on('click', this.createGarageView);
    this.winnersBtn.on('click', this.createWinnersView);
  }

  public start(): void {
    this.createView();
  }

  protected createView(): void {
    const btnBox = new BaseComponent({ tag: 'div', classNames: [styles.btnBox] });
    btnBox.append(this.garageBtn, this.winnersBtn);
    this.root.append(btnBox);
    document.body.append(this.root.getElement());
    this.createGarageView();
  }

  protected createGarageView = () => {
    if (this.winnersView) {
      this.winnersView.destroy();
    }
    this.garageView = new GarageView(this.winnersBtn);
    this.root.append(this.garageView);
    this.garageBtn.disable();
    this.winnersBtn.enable();
  };

  protected createWinnersView = () => {
    if (!this.garageView) {
      throw new Error('garageview is undefined');
    }
    state.saveGarageState(this.garageView.getFormsState());
    this.garageView.destroy();
    this.winnersView = new WinnersView();
    this.root.append(this.winnersView);
    this.winnersBtn.disable();
    this.garageBtn.enable();

    state.resetRace();
  };
}
