import SparkMD5 from 'spark-md5';
import { RequestOptions } from './requestType';
import { useCacheStore } from './cacheStore';
import { useRequestor, createEventDrivenRequestor } from './requestor';
import type { Requestor, Response } from './requestType';

// 哈希生成请求的唯一标识
export const hashRequest = (req: RequestOptions & { url: string }) => {
    const spark = new SparkMD5();

    spark.append(req.url);
    for (const [key, value] of Object.entries(req.headers || {})) {
        spark.append(key);
        spark.append(value);
    }
    if (req.body) {
        spark.append(JSON.stringify(req.body));
    }
    return spark.end();
};

// 创建幂等请求器
export const createIdemportentRequestor = (getKey?: boolean): Requestor => {
    const baseRequestor = useRequestor();
    const req = createEventDrivenRequestor(baseRequestor);
    const cacheStore = useCacheStore(false); // 使用内存缓存

    const idemportentRequest = async <T>(
        method: keyof Requestor,
        url: string,
        options: RequestOptions
    ): Promise<Response<T>> => {
        const config = {
            ...options,
            url,
        };

        // 生成缓存键
        const key = getKey ? JSON.stringify(config) : hashRequest(config);

        // 检查缓存
        const cachedResponse = await cacheStore.get<Response<T>>(key);
        if (cachedResponse) {
            return cachedResponse; // 返回缓存结果
        }

        // 发起请求
        const response = await req[method](url, options);

        // 缓存结果
        await cacheStore.set(key, response);

        return response;
    };

    // 返回幂等请求器
    return {
        get<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
            return idemportentRequest('get', url, options);
        },
        post<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
            return idemportentRequest('post', url, options);
        },
        put<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
            return idemportentRequest('put', url, options);
        },
        delete<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
            return idemportentRequest('delete', url, options);
        },
        patch<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
            return idemportentRequest('patch', url, options);
        },
        // request<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
        //     return idemportentRequest('request', url, options);
        // },
    };
};
