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

export type ButtonProps = Omit<Props, 'tag'> & {
  type?: string;
  disabled?: boolean;
};

export type CarData = NewCarData & {
  id: number;
  status?: 'stop' | 'drive' | 'broken';
  duration: number;
  wins: number;
};

export type NewCarData = {
  name: string;
  color: string;
};

export type RandomCar = { [key: string]: string[] };

export type WinnerData = {
  wins: number;
  time: number;
};

export type NewWinnerData = WinnerData & {
  id: number;
};

export type Params = {
  key: string;
  value: string;
};

export type WinnerWithCar = NewWinnerData & NewCarData;

export enum SortState {
  none = '',
  wins = 'wins',
  time = 'time',
}

export enum OrderState {
  none = '',
  up = 'ASC',
  down = 'DESC',
}

export type FormState = {
  formName: string;
  disabled: boolean;
  nameInput: string;
  colorInput: string;
  currentId: number;
};

export type InputData = NewCarData & {
  id: number;
};
