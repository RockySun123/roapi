export { inject, useRequestor } from './requestor'
export { createCacheRequestor } from './createCacheRequestor'
export { createIdemportentRequestor } from './createIdempotentRequestor'
export { createParalleRequestor } from './createParalleRequestor'
export { createRetryRequestor } from './createRetryRequestor'
export { createSerialRequestor } from './createSerialRequestor'

export type { RequestMethod, RequestOptions, Response, Requestor, RequireOne } from './requestType'