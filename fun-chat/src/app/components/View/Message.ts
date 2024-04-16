import BaseComponent from './BaseComponent';

// type MessageProps = {
//   id: string;
//   text: string;
//   status: string;
//   date: string;
//   author: string;
// };

export default class Message extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['message'] });
  }
}
