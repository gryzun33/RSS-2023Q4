import emitter from './EventEmitter';
import { EVENT } from '../utils/constants';

const ERRORS = {
  login: 'a user with this login is already authorized',
  password: 'incorrect password',
};

export default class ErrorHandler {
  public onError(text: string): void {
    switch (text) {
      case ERRORS.login:
        emitter.emit(EVENT.incorrect_auth, ERRORS.login);
        break;
      case ERRORS.password:
        emitter.emit(EVENT.incorrect_auth, ERRORS.password);
        break;
      default:
        console.error('unknown error type');
        break;
    }
  }
}
