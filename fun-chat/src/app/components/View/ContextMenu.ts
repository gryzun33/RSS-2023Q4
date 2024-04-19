import BaseComponent from './BaseComponent';
import Button from './Button';

export default class ContextMenu extends BaseComponent {
  protected editBtn = new Button({
    type: 'text',
    classNames: ['edit-btn'],
    text: 'Edit',
  });

  protected deleteBtn = new Button({
    type: 'text',
    classNames: ['delete-btn'],
    text: 'Delete',
  });
  constructor() {
    super({ tag: 'div', classNames: ['context-menu'] });
    this.createView();
  }

  protected createView() {
    this.append(this.editBtn, this.deleteBtn);
  }
}
