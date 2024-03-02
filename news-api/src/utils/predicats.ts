export function isType<T>(element: T | null, type: { new (): T }): element is T {
  return element instanceof type;
}

export function isUndefined<T>(value: T | undefined): value is undefined {
  return typeof value === 'undefined';
}

export function isNull<T>(value: T | null): value is null {
  return value === 'null';
}

export function isString<T>(value: T | string): value is string {
  return typeof value === 'string';
}
