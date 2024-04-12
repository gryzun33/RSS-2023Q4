export class StorageService<T> {
  protected keys = new Set<string>();
  constructor(private keyPrefix: string) {}

  private getStorageKey(key: string): string {
    const resultKey = `${this.keyPrefix}_${key}`;
    this.keys.add(resultKey);
    return resultKey;
  }

  public saveData<K extends keyof T>(key: K, data: T[K]): void {
    const storageKey = this.getStorageKey(key.toString());
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }

  public getData<K extends keyof T>(key: K): T[K] | null {
    const storageKey = this.getStorageKey(key.toString());
    const data = sessionStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }

  public removeStorage(): void {
    this.keys.forEach((key: string) => {
      sessionStorage.removeItem(key);
    });
  }
}

export type UserState = {
  user: {
    login: string;
    password: string;
  };
};

const storage = new StorageService<UserState>('gryzun33-chat');

export default storage;
