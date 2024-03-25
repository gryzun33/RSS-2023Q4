import InteractionForm from './InteractionForm';
import { createCar } from '../api';
import { CarData, NewCarData } from '../utils/types';

export default class CreateCarForm extends InteractionForm {
  constructor() {
    super();
    this.addClass('create-form');
    this.submitBtn.setTextContent('Create');

    this.on('submit', this.onSubmitHandler);
  }

  protected onSubmitHandler = (e: Event) => {
    e.preventDefault();
    const newCarData: NewCarData = {
      name: this.getInputValue(this.inputName),
      color: this.getInputValue(this.inputColor),
    };
    createCar(this.viewData, newCarData);

    this.element.reset();

    // console.log('name=', this.getInputValue(this.inputName));
    // console.log('color=', this.getInputValue(this.inputColor));
  };

  public viewData = (data: CarData) => {
    console.log('datafromresponse', data);
  };
}
