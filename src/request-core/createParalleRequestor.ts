import { useRequestor, createEventDrivenRequestor } from "./requestor";
import type { Requestor, Response, RequestOptions } from './requestType'

//创建一个并发请求
export function createParalleRequestor(maxCount: number = 4): Requestor {
    const baseRequestor = useRequestor();
    const req = createEventDrivenRequestor(baseRequestor)
    //创建队列
    const queue: Array<() => void> = []
    //当前活跃请求书
    let activeCount = 0

    //控制并发请求
    function enqueue<T>(fn: () => Promise<Response<T>>): Promise<Response<T>> {
        return new Promise((resolve, reject) => {// 返回一个新的 Promise，表示整个任务的执行结果。
            const task = () => { // 封装为一个任务
                activeCount++;// 增加正在执行的任务数
                fn()
                    .then((res) => {
                        resolve(res) // 将结果传递给调用者
                    })
                    .catch(reject)// 如果 fn 出错，直接 reject 调用者
                    .finally(() => {// 不论成功或失败，清理任务
                        activeCount--;// 减少正在执行的任务数
                        if (queue.length > 0) {// 如果有排队任务，取出并执行
                            const nextTask = queue.shift();
                            nextTask?.()// 执行下一个任务
                        }
                    })
            }

            if (activeCount < maxCount) {// 如果未达到并发上限，直接执行
                task()
            } else {// 达到并发上限，放入队列
                queue.push(task)
            }
        })
    }

    //包装请求方法
    async function parallelRequest<T>(
        method: keyof Requestor,
        url: string,
        options: RequestOptions = { responseType: 'json' }
    ): Promise<Response<T>> {
        return enqueue(() => req[method](url, options as RequestOptions))
    }

    //定义新的 Requestor
    return {
        get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return parallelRequest('get', url, options)
        },
        post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return parallelRequest('post', url, options)
        },
        put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return parallelRequest('put', url, options)
        },
        delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return parallelRequest('delete', url, options)
        },
        patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
            return parallelRequest('patch', url, options)
        },
        // request<T = any>(url: string, options: RequestOptions): Promise<Response<T>> {
        //     return parallelRequest('request', url, options)
        // }
    }
}