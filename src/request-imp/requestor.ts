// import axios from "axios";
import type { Requestor, RequestOptions, RequestMethod } from '../request-core'
import request from './fetchRequest'

export const requestor: Requestor = {
    get: (url: string, options: RequestOptions) => {
        return request('GET', url, options)
    },
    post: (url: string, options: RequestOptions) => {
        return request('POST', url, options)
    },
    put: (url: string, options) => {
        return request('PUT', url, options)
    },
    delete: (url: string, options) => {
        return request('DELETE', url, options)
    },
    patch: (url: string, options) => {
        return request('PATCH', url, options)
    }
}

export default (options: RequestOptions) => {
    const { url, method } = options
    const newMethod = method.toLowerCase() as Lowercase<RequestMethod>
    return requestor[newMethod](url!, options)
}