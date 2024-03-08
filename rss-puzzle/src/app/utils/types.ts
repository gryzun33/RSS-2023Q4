export type Props<T extends HTMLElement = HTMLElement> = Partial<T> & {
  tag?: keyof HTMLElementTagNameMap;
  classNames?: string[];
  text?: string;
  callback?: СallbackFunc;
};

export type InputProps = Omit<Props, 'tag'> & {
  type: string;
  placeholder: string;
  required?: boolean;
  minlength: string;
  pattern: string;
  onChange: () => void;
};

export type ButtonProps = Omit<Props, 'tag'> & {
  type?: string;
  disabled?: boolean;
};

export type СallbackFunc = () => void;
