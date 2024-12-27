import {
    inject,
    useRequestor,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor
} from './request-core'
import request, { requestor } from './request-imp'
import { Requestor } from './request-core'

inject(requestor as Requestor)

export {
    request,
    useRequestor,
    createCacheRequestor,
    createIdemportentRequestor,
    createParalleRequestor,
    createRetryRequestor
}

// export default request