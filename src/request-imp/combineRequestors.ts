import type { Requestor } from '../request-core/requestType'
type RequestorEnhancer = (baseRequestor: Requestor) => Requestor

export function combineRequestors(baseRequestor: Requestor, ...enhancers: RequestorEnhancer[]): Requestor {
    return enhancers.reduce((currentRequestor, enhancer) => enhancer(currentRequestor), baseRequestor)
}
