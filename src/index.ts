import {
    inject,
    useRequestor,
    hashRequest as getHashKey,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor,
    createSerialRequestor
} from './request-core'
import request,
{
    requestor,
    use,
    setRequestInterceptor,
    setResponseInterceptor,
    requestControlls,
    combineRequestors
} from './request-imp'
import type { Requestor } from './request-core'

inject(requestor as Requestor)

export {
    request,
    useRequestor,
    getHashKey,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor,
    createSerialRequestor,
    setRequestInterceptor,
    setResponseInterceptor,
    use,
    requestControlls,
    combineRequestors
}
export type { MethodMustOpts, BaseRequestor } from './request-imp'

// export default request

//todo 请求关闭
