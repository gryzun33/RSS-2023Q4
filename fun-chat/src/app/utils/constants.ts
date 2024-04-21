const EVENT = {
  change_message: 'change-message',
  delete_message: 'delete-message',
  set_dialog_user: 'set-dialog-user',
  change_status: 'change-status',
  add_message: 'add-message',
  add_messages: 'add-messages',
  delivered: 'delivered',
  readed: 'readed',
  send_message: 'send-message',
  edited: 'edited',
  deleted: 'deleted',
  reset_new_message: 'reset-new-message',
  external_login: 'external-login',
  external_logout: 'external-logout',
  update_notifications: 'update-notifications',
  login: 'login',
  logout: 'logout',
  get_notifications: 'get-notifications',
  set_readed: 'set-readed',
  edit_message: 'edit-message',
  navigate: 'navigate',
  incorrect_auth: 'incorrectAuth',
  connect: 'connect',
  disconnect: 'disconnect',
};

const REQUESTS = {
  login: 'USER_LOGIN',
  logout: 'USER_LOGOUT',
  activeUsers: 'USER_ACTIVE',
  inactiveUsers: 'USER_INACTIVE',
  msgFromUser: 'MSG_FROM_USER',
  messSend: 'MSG_SEND',
  messRead: 'MSG_READ',
  messEdit: 'MSG_EDIT',
  messDelete: 'MSG_DELETE',
};

const AUTHOR_LINK = 'https://gryzun33.github.io/rsschool-cv/';
const RSS_LINK = 'https://rs.school/';
const YEAR = '2024';

export { EVENT, AUTHOR_LINK, RSS_LINK, YEAR, REQUESTS };
