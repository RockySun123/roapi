import type { Requestor, RequestOptions, RequestMethod, RequireOne } from '../request-core'
import request from './fetchRequest'

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
    if (requestInterceptor) {
        options = await requestInterceptor(options)
    }
    let response = await currentRequestor(url, options);
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