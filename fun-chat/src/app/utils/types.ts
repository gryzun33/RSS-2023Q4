export type Props = {
  tag?: keyof HTMLElementTagNameMap;
  classNames?: string[];
  text?: string;
  callback?: () => void;
};

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

export type UserResponse = {
  login: string;
  isLogined: boolean;
};

export type User = {
  login: string;
  isLogined: boolean;
  unreaded?: number;
};
