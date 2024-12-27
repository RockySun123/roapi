import type { Requestor, EventDrivenRequestor } from './requestType'

let req: Requestor
export function inject(requestor: Requestor) {
    req = requestor
}

export function useRequestor() {
    return req
}


export function createEventDrivenRequestor(baseRequestor: Requestor): EventDrivenRequestor {
    const eventListeners: Record<string, Function[]> = {}

    const trigger = async (event: 'beforeRequest' | 'responseBody', ...args: any[]) => {
        if (!eventListeners[event]) return undefined
        for (const listener of eventListeners[event]) {
            const res = await listener(...args)
            if (res !== undefined) return res
        }
        return undefined
    }

    const requestor: EventDrivenRequestor = {
        ...baseRequestor,
        on(event: string, callback: Function) {
            if (!eventListeners[event]) {
                eventListeners[event] = []
            }
            eventListeners[event].push(callback)
        },
        async get(url, options) {
            const response = await trigger('beforeRequest', { url, ...options }) ??
                await baseRequestor.get(url, options);
            trigger('responseBody', { url, ...options }, response);
            return response
        },
        async post(url, options) {

            const response = trigger('beforeRequest', { url, ...options }) ??
                await baseRequestor.post(url, options);
            trigger('responseBody', { url, ...options }, response);
            return response
        },
        async put(url, options) {
            const response = trigger('beforeRequest', { url, ...options }) ??
                await baseRequestor.put(url, options);
            trigger('responseBody', { url, ...options }, response);
            return response
        },
        async delete(url, options) {
            const response = trigger('beforeRequest', { url, ...options }) ??
                await baseRequestor.delete(url, options);
            trigger('responseBody', { url, ...options }, response);
            return response
        },
        async patch(url, options) {
            const response = trigger('beforeRequest', { url, ...options }) ??
                await baseRequestor.patch(url, options);
            trigger('responseBody', { url, ...options }, response);
            return response
        }
    }
    return requestor
}
