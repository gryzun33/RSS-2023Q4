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
};

export type NewCarData = {
  name: string;
  color: string;
};
