import InteractionForm from '../utilsComponents/InteractionForm';
import emitter from '../EventEmitter';
import { NewCarData } from '../../utils/types';
import { updateCar } from '../api';
import state from '../State';

export default class CreateCarForm extends InteractionForm {
  public currentId: number = 0;
  constructor() {
    super();
    this.addClass('update-form');
    this.disable();
    this.submitBtn.setTextContent('Update');
    emitter.on('enableUpdateForm', this.enableForm);
    this.on('submit', this.onSubmitHandler);
  }

  protected enableForm = (id: unknown) => {
    if (typeof id !== 'number') {
      throw new Error('id is not string');
    }
    this.enable();
    this.inputName.element.focus();
    this.currentId = id;
    const carData = state.getCarData(id);
    if (!carData) {
      throw new Error('carData is undefined');
    }
    const { name, color } = carData;
    this.inputName.element.value = name;
    this.inputColor.element.value = color;
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
