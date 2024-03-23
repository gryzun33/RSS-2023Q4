import InteractionForm from './InteractionForm';

export default class CreateCarForm extends InteractionForm {
  constructor() {
    super();
    this.submitBtn.setTextContent('Create');
  }
}
