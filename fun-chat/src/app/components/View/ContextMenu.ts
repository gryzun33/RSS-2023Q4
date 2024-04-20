import BaseComponent from './BaseComponent';
import Button from './Button';
import emitter from '../EventEmitter';
import state from '../State';

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
  constructor(
    public id: string,
    public text: string
  ) {
    super({ tag: 'div', classNames: ['context-menu'] });
    this.createView();
    this.editBtn.on('click', this.onClickEditBtn);
  }

  protected createView() {
    this.append(this.editBtn, this.deleteBtn);
  }

  protected onClickEditBtn = () => {
    emitter.emit('change-message', this.text);
    state.setEditedMsg(this.id, this.text);
  };
}
