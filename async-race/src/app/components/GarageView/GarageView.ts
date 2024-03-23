import BaseComponent from '../BaseComponent';
import CreateCarForm from '../CreateCarForm';
import UpdateCarForm from '../UpdateCarForm';

export default class GarageView extends BaseComponent {
  protected createForm = new CreateCarForm();
  protected updateForm = new UpdateCarForm();
  protected totalCars: number = 0;
  protected page: number = 1;
  constructor() {
    super({ tag: 'div', classNames: ['garage-wrapper'] });
    this.createView();
  }

  protected createView(): void {
    this.append(this.createForm, this.updateForm);
  }
}
