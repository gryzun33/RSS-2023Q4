import InteractionForm from '../utilsComponents/InteractionForm';
import emitter from '../EventEmitter';
import { NewCarData } from '../../utils/types';
import { updateCar } from '../api';

export default class CreateCarForm extends InteractionForm {
  public currentId: string = '';
  constructor() {
    super();
    this.addClass('update-form');
    this.disable();
    this.submitBtn.setTextContent('Update');
    emitter.on('enableUpdateForm', this.enableForm);
    this.on('submit', this.onSubmitHandler);
  }

  protected enableForm = (id: unknown) => {
    if (typeof id !== 'string') {
      throw new Error('id is not string');
    }
    this.enable();
    this.currentId = id;
  };

  protected onSubmitHandler = (e: Event) => {
    e.preventDefault();
    const carData: NewCarData = {
      name: this.getInputValue(this.inputName),
      color: this.getInputValue(this.inputColor),
    };
    updateCar(this.currentId, carData);

    this.resetForm();
    this.disable();
  };
}
