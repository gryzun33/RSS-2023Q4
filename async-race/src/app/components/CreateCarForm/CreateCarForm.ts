import InteractionForm from '../utilsComponents/InteractionForm';
import { createCar } from '../api';
import { NewCarData } from '../../utils/types';
// import emitter from './EventEmitter';

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
    createCar(newCarData);

    this.resetForm();
  };
}
