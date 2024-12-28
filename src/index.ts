import {
    inject,
    useRequestor,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor,
    createSerialRequestor
} from './request-core'
import request, { requestor, use, setRequestInterceptor, setResponseInterceptor } from './request-imp'
import type { Requestor } from './request-core'

inject(requestor as Requestor)

export {
    request,
    useRequestor,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor,
    createSerialRequestor,
    setRequestInterceptor,
    setResponseInterceptor,
    use
}
export type { MethodMustOpts, BaseRequestor } from './request-imp'
// export default request