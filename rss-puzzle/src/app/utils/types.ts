export type Props<T extends HTMLElement = HTMLElement> = Partial<T> & {
  tag?: keyof HTMLElementTagNameMap;
  classNames?: string[];
  text?: string;
};

export type InputProps = Omit<Props, 'tag'> & {
  type: string;
  placeholder: string;
  required?: boolean;
};

export type ButtonProps = Omit<Props, 'tag'> & {
  type: string;
  disabled?: boolean;
};
