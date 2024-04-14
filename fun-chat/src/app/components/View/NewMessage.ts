import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';

export default class newMessage extends BaseComponent {
  constructor(props: Props) {
    super(props);
    this.createView();
  }

  protected createView() {}
}
