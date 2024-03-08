export class StorageService<T> {
  protected keys = new Set<string>();
  constructor(private keyPrefix: string) {}

  private getStorageKey(key: string): string {
    const resultKey = `${this.keyPrefix}_${key}`;
    this.keys.add(resultKey);
    return resultKey;
  }

  public saveData<K extends keyof T>(key: K, data: T[K]): void {
    console.log('savedata');

    const storageKey = this.getStorageKey(key.toString());
    console.log('storagekey', storageKey);
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  public getData<K extends keyof T>(key: K): string | null {
    const storageKey = this.getStorageKey(key.toString());
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }

  public removeStorage(): void {
    console.log('remove');
    this.keys.forEach((key: string) => {
      console.log('removkey', key);
      localStorage.removeItem(key);
    });
  }
}

export type StorageState = {
  name: string;
  surname: string;
};

export const storage = new StorageService<StorageState>('gryzun33-puzzle');
console.log('sorage=', storage);
