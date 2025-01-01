import { useCacheStore, hashRequest } from './cacheStore';
import { useRequestor, createEventDrivenRequestor } from './requestor';
import type { RequestOptions, Requestor, Response, RequireOne } from './requestType'


export interface CacheRequestorOptions {
    key?: (config: RequestOptions & { url: string }) => string;//缓存键生成函数,
    persist?: boolean;//是否持久化缓存
    duration?: number;//缓存时长(毫秒)
    isValid?: (key: string, config: RequestOptions) => boolean; //自定义缓存有效性校验函数
}

//参数归一化
export function normalizeOptions(options: CacheRequestorOptions): Required<CacheRequestorOptions> {
    return {
        key: options?.key ? options.key : hashRequest,
        persist: options?.persist ?? false,
        duration: options?.duration ?? 1000 * 60 * 60,//默认缓存1小时
        isValid: options?.isValid ?? (() => true)//默认缓存一直有效
    }
}

//缓存键生成函数
export function createCacheRequestor(cacheOptions: CacheRequestorOptions = { duration: 1000 * 60 * 60 }) {
    return (baseRequestor?: Requestor): Requestor => {
        const options = normalizeOptions(cacheOptions)
        const store = useCacheStore(options.persist);
        baseRequestor = baseRequestor || useRequestor()
        const req = createEventDrivenRequestor(baseRequestor)

        req.on("beforeRequest", async (config: RequireOne<RequestOptions, 'url'>) => {
            config.responseType = config.responseType || 'json'
            const key = options.key(config)
            if (await store.has(key)) {
                const cacheResponse = await store.get<{ timestamp: number; data: Response }>(key)
                if (
                    cacheResponse &&
                    (!options.isValid ||
                        options.isValid(key, config) ||
                        (options.duration && Date.now() - cacheResponse.timestamp <= options.duration)
                    )
                ) {
                    //阻止 进入 responseBody 事件
                    return cacheResponse.data//返回缓存数据
                }
            }
        })
        req.on('responseBody', async (config: RequireOne<RequestOptions, 'url'>, resp: Response) => {
            const key = options.key(config);//缓存键
            await store.set(key, { timestamp: Date.now(), data: resp })
        })
        return req
    }
}