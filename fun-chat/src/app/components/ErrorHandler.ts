import emitter from './EventEmitter';

const ERRORS = {
  login: 'a user with this login is already authorized',
  password: 'incorrect password',
};

export default class ErrorHandler {
  public onError(text: string) {
    switch (text) {
      case ERRORS.login:
        console.log('incorrectlogin');
        emitter.emit('incorrectAuth', ERRORS.login);
        break;
      case ERRORS.password:
        console.log('incorrectpass');
        emitter.emit('incorrectAuth', ERRORS.password);
        break;

      default:
        console.log('unknown error type');
        break;
    }
  }
}
