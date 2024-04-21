import { MessageProps } from './types';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isMessageProps(obj: any): obj is MessageProps {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.date === 'string' &&
    typeof obj.author === 'boolean' &&
    typeof obj.dialogUser === 'string'
  );
}

export { formatDate, isMessageProps };
