import type { RequireOne } from '../request-core/requestType'
import type { MethodMustOpts } from './requestor'


type AbortControllers = Map<string, AbortController>
export type URLMustOpts = RequireOne<MethodMustOpts, 'url'>

class RequestAbortManager {
    private controllers: AbortControllers = new Map()
    //注册请求
    registry(key: string): AbortController | undefined {
        if (this.controllers.has(key)) {
            throw new Error(`${key} 已经存在，不能重复注册`)
        }
        const controller = new AbortController()
        this.controllers.set(key, controller)
        return controller
    }
    // 中断
    abort(key: string): void {
        const controller = this.controllers.get(key)
        controller?.abort()
        this.controllers.delete(key)
    }

    //中断所有
    abortAll(): void {
        this.controllers.forEach(controller => {
            controller.abort()
        })
        this.controllers.clear()
    }
    //检查是否存在某个请求
    has(key: string): boolean {
        return this.controllers.has(key)
    }
}

export const reqAborts = new RequestAbortManager()

export const requestControlls = {
    cancel: (key: string) => {
        reqAborts.abort(key)
    },
    cancelAll: () => {
        reqAborts.abortAll()
    },
    has: (key: string) => {
        return reqAborts.has(key)
    }
}