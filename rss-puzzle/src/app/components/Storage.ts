export class StorageService<T> {
  constructor(private keyPrefix: string) {}

  private getStorageKey(key: string): string {
    return `${this.keyPrefix}_${key}`;
  }

  public saveData<K extends keyof T>(key: K, data: T[K]): void {
    console.log('savedata');
    const storageKey = this.getStorageKey(key.toString());
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  public getData<K extends keyof T>(key: K): string | null {
    const storageKey = this.getStorageKey(key.toString());
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }
}

export type StorageState = {
  name: string;
  surname: string;
};

export const storage = new StorageService<StorageState>('gryzun33-puzzle');
