//请求串行
import { useRequestor, createEventDrivenRequestor } from './requestor'
import type { Requestor, RequestOptions, Response } from './requestType'

export const createSerialRequestor = () => {
    return (baseRequestor?: Requestor): Requestor => {
        baseRequestor = baseRequestor || useRequestor();
        const req = createEventDrivenRequestor(baseRequestor)

        //请求队列
        const requestQueue: (() => Promise<void>)[] = []
        let isProcessing = false

        const processQueue = async () => {
            if (isProcessing || requestQueue.length === 0) return
            isProcessing = true;
            const nextTask = requestQueue.shift();

            if (nextTask) {
                await nextTask();//执行任务
            }
            isProcessing = false

            //递归处理剩余任务
            await processQueue()
        }

        // 包装请求逻辑
        const serialRequest = async <T>(
            method: keyof Requestor,
            url: string,
            options?: RequestOptions
        ): Promise<Response<T>> => {
            return new Promise<Response<T>>((resolve, reject) => {
                //创建任务
                const task = async () => {
                    try {
                        const response = await req[method](url, options || { responseType: 'json' })
                        resolve(response)
                    } catch (error) {
                        reject(error)
                    }
                }

                //添加任务到队列
                requestQueue.push(task);

                //开始处理队列
                void processQueue()
            })
        }

        //返回封装后的请求对象
        return {
            get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
                return serialRequest('get', url, options)
            },
            post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
                return serialRequest('post', url, options)
            },
            put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
                return serialRequest('put', url, options)
            },
            delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
                return serialRequest('delete', url, options)
            },
            patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
                return serialRequest('patch', url, options)
            }
        }
    }
}