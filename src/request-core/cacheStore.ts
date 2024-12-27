export interface CacheStore {
    has(key: string): Promise<boolean>
    set<T>(key: string, value: T): Promise<void>
    get<T>(key: string): Promise<T | undefined>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}


export function createMemoryStore(): CacheStore {
    const memory = new Map<string, any>()
    return {
        async has(key: string): Promise<boolean> {
            return memory.has(key);
        },
        async set<T>(key: string, value: T): Promise<void> {
            memory.set(key, value);
        },
        async get<T>(key: string): Promise<T | undefined> {
            return memory.get(key);
        },
        async delete(key: string): Promise<void> {
            memory.delete(key);
        },
        async clear(): Promise<void> {
            memory.clear();
        },
    }
}

export function createStorageStore(): CacheStore {
    return {
        async has(key: string): Promise<boolean> {
            return localStorage.getItem(key) !== null;
        },
        async set<T>(key: string, value: T): Promise<void> {
            localStorage.setItem(key, JSON.stringify(value));
        },
        async get<T>(key: string): Promise<T | undefined> {
            const item = localStorage.getItem(key);
            if (item === null) return undefined;
            return JSON.parse(item);
        },
        async delete(key: string): Promise<void> {
            localStorage.removeItem(key);
        },
        async clear(): Promise<void> {
            localStorage.clear();
        }
    }
}

//缓存存储工厂
export function useCacheStore(persits: boolean): CacheStore {
    return persits ? createStorageStore() : createMemoryStore()
}