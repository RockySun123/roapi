import SparkMD5 from 'spark-md5';
import type { RequestOptions } from './requestType';

export interface CacheStore {
    has(key: string): Promise<boolean>
    set<T>(key: string, value: T): Promise<void>
    get<T>(key: string): Promise<T | undefined>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}

// 哈希生成请求的唯一标识
export const hashRequest = (req: RequestOptions & { url: string }) => {
    const spark = new SparkMD5();
    spark.append(req.url);
    for (const [key, value] of Object.entries(req.headers || {})) {
        spark.append(key);
        spark.append(value);
    }
    if (req.body) {
        spark.append(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    }
    if (req.params) {
        spark.append(JSON.stringify(req.params))
    }
    if (req.data) {
        spark.append(JSON.stringify(req.data));
    }

    return spark.end();
};

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