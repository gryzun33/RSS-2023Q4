import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';

export default class Main extends BaseComponent {
  constructor(props: Props) {
    super(props);
    this.createView();
  }
  protected createView() {
    // this.append()
  }
}
