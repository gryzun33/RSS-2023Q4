export type Props = {
  tag?: keyof HTMLElementTagNameMap;
  classNames?: string[];
  text?: string;
  callback?: () => void;
};

export type Listener = (...args: unknown[]) => void;

export type Handler = {
  eventType: string;
  callback: (event: Event) => void;
};

export type Route = {
  path: string;
  callback: () => void;
};

export type ButtonProps = Omit<Props, 'tag'> & {
  type?: string;
  disabled?: boolean;
};

export type InputProps = Omit<Props, 'tag'> & {
  type: string;
  placeholder?: string;
  required?: boolean;
  minlength: string;
  pattern: string;
  toolTip: string;
  label: string;
  autocomplete?: string;
};

export type CurrentUser = {
  id: string;
  login: string;
  password: string;
};

export type MessageProps = {
  id: string;
  text: string;
  status: string;
  date: string;
  author: boolean;
  dialogUser: string;
  isEdited: boolean;
};

export enum MessageStatus {
  Sent = 'sent',
  Delivered = 'delivered',
  Readed = 'readed',
  Edited = 'edited',
}

export type StatusResponse = {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
};

export type UserData = {
  notifications: number;
  isLogined: boolean;
};

export type EditedMsg = {
  id: string;
  text: string;
};

export type Unreaded = {
  id: string;
  from: string;
};

export enum Navigation {
  BACK_FROM_ABOUT = 'back',
  MAIN = 'main',
  ABOUT = 'about',
  LOGIN = 'login',
}
