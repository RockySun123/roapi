import type { Requestor, RequestOptions, RequestMethod, RequireOne } from '../request-core'
import request from './fetchRequest'
import { reqAborts } from './abortControllers'

export type MethodMustOpts = RequireOne<RequestOptions, 'method'>
export type BaseRequestor = <T = any>(url: string, options: MethodMustOpts) => Promise<T>;

let currentRequestor: BaseRequestor = request;


//拦截器支持
type Interceptor<T> = (data: T) => T | Promise<T>;
let requestInterceptor: Interceptor<MethodMustOpts> | null = null
let responseInterceptor: Interceptor<any> | null = null

export const setRequestInterceptor = (interceptor: Interceptor<MethodMustOpts>) => {
    requestInterceptor = interceptor
}

export const setResponseInterceptor = (interceptor: Interceptor<any>) => {
    responseInterceptor = interceptor
}

//执行请求带拦截器
const executeWithInterceptors: BaseRequestor = async (url, options) => {
    options.responseType = options.responseType || 'json'
    //拦截请求参数
    if (requestInterceptor) {
        options = await requestInterceptor(options)
    }
    //是否需要取消请求
    let signal;
    let { cancelKey, ...restOptions } = options
    if (cancelKey) {
        const controller = reqAborts.registry(cancelKey)
        signal = controller?.signal
    }
    let response = await currentRequestor(url, { ...restOptions, signal });
    //拦截响应数据
    if (responseInterceptor) {
        response = await responseInterceptor(response);
    }
    return response
}

const getRequestor = (): Requestor => {
    return {
        get: (url, options = {}) => executeWithInterceptors(url, { ...options, method: 'GET' }),
        post: (url, options = {}) => executeWithInterceptors(url, { ...options, method: 'POST' }),
        put: (url, options = {}) => executeWithInterceptors(url, { ...options, method: 'PUT' }),
        delete: (url, options = {}) => executeWithInterceptors(url, { ...options, method: 'DELETE' }),
        patch: (url, options = {}) => executeWithInterceptors(url, { ...options, method: 'PATCH' })
    }
}

export const requestor = getRequestor()

export default (options: MethodMustOpts) => {
    const { url, method } = options
    const newMethod = method.toLowerCase() as Lowercase<RequestMethod>
    return requestor[newMethod](url!, options)
}


export const use = (baseRequestor: BaseRequestor) => {
    currentRequestor = baseRequestor
}