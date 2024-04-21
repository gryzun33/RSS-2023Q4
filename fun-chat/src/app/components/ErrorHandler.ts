import emitter from './EventEmitter';

const ERRORS = {
  login: 'a user with this login is already authorized',
  password: 'incorrect password',
};

export default class ErrorHandler {
  public onError(text: string): void {
    switch (text) {
      case ERRORS.login:
        emitter.emit('incorrectAuth', ERRORS.login);
        break;
      case ERRORS.password:
        emitter.emit('incorrectAuth', ERRORS.password);
        break;
      default:
        console.error('unknown error type');
        break;
    }
  }
}
