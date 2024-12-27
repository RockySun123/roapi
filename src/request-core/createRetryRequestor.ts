import type { Requestor, RequestOptions, Response } from './requestType'
import { useRequestor, createEventDrivenRequestor } from './requestor';
export function createRetryRequestor(maxCount: number = 5, duration = 500): Requestor {
    const baseRequestor = useRequestor();
    const req = createEventDrivenRequestor(baseRequestor)
    //实现重试逻辑
    //包装一个带有重试逻辑的请求方法
    async function retryRequest<T>(
        method: keyof Requestor,
        url: string,
        options?: RequestOptions,
        retries: number = maxCount
    ): Promise<Response<T>> {
        try {
            return await req[method](url, options as RequestOptions)
        } catch (error) {
            if (retries > 0) {
                console.log(`请求失败，正在重试...剩余次数：${retries}`)
                setTimeout(() => {
                    return retryRequest(method, url, options, retries - 1)
                }, duration)
                return Promise.reject()
            }
            console.error('请求失败，已达到最大重试次数')
            throw error
        }
    }

    //定义新的 Requestor 
    return {
        get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return retryRequest('get', url, options)
        },
        post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return retryRequest('post', url, options)
        },
        put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return retryRequest('put', url, options)
        },
        delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return retryRequest('delete', url, options)
        },
        patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return retryRequest('patch', url, options)
        },
    }
}
