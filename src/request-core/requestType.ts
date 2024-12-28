export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type RequireOne<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
export interface RequestOptions {
    // 请求URL
    url?: string,
    method?: RequestMethod, // 限定请求方法
    headers?: Record<string, string>, // 请求头
    body?: any, // 请求体
    data?: any, // 请求体
    params?: Record<string, any>, // 查询参数
    timeout?: number, // 超时时间
    withCredentials?: boolean, // 是否携带凭证
    responseType?: XMLHttpRequestResponseType, // 响应类型
    // onDownloadProgress?: (progressEvent: ProgressEvent) => void, // 下载进度回调
    // onUploadProgress?: (progressEvent: ProgressEvent) => void, // 上传进度回调
}

export interface Response<T = any> {
    data: T, // 响应数据
    status: number, // HTTP 状态码
    statusText: string, // 状态文本
    // headers: Record<string, string>, // 响应头
    // config: RequestOptions, // 请求配置
    // request?: any, // 原始请求对象
    toPlain: () => any, // 转换为普通对象的方法
}

export interface Requestor {
    get<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>,
    post<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>,
    put<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>,
    delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>,
    patch<T = any>(url: string, options?: RequestOptions): Promise<Response<T>>,
    // request<T = any>(url: string, options: RequestOptions): Promise<Response<T>>, // 通用请求方法
}

export interface EventDrivenRequestor extends Requestor {
    on(event: 'beforeRequest' | 'responseBody', callback: Function): void
}

