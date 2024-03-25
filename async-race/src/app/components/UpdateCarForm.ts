import InteractionForm from './InteractionForm';

export default class CreateCarForm extends InteractionForm {
  constructor() {
    super();
    this.addClass('update-form');
    this.disable();
    this.submitBtn.setTextContent('Update');
  }
}
