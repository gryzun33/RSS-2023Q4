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

export type WordData = {
  word: string;
  oldNumber: number;
  newNumber: number;
  width: string;
  bgSize: number;
  bgPositionX: number;
};

export type HintsState = {
  image: boolean;
  translation: boolean;
  sound: boolean;
};

export type PieceData = {
  oldInd: number;
  newInd: number;
  parent: string;
  word: string;
};

export type Statistics = number[][];

export type Handler = {
  eventType: string;
  callback: (event: Event) => void;
};
