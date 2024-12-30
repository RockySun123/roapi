# rokapi 
![rokapi](https://img.shields.io/badge/rokapi-v1.0.0-green
)
## 📖 简介

✅ 可自定义底层请求的请求库，包括 请求重试、请求缓存、请求幂等、请求串行、请求并发，默认底层为fetch，可以使用 use 切换底层实现，见下面文档。


## 🎁 安装

```bash
npm install rokapi

pnpm install rokapi

yarn add rokapi
```

### 📚 文档

|名称 |描述|默认值|
|:---|:---|:---|
|request|默认请求函数||
|useRequestor|获取请求函数||
|createCacheRequestor|创建带有缓存的请求函数 ({key?,persist?,duration?,isValid?})|{duration:3600000}|
|createIdemportentRequestor|创建幂等请求函数 (getKey)|false|
|createParalleRequestor|创建可并发的请求函数 (maxCount)|4|
|createRetryRequestor|创建可重试请求的函数 (maxCount, duration)|(5, 500)|
|createSerialRequestor|创建可串行的请求函数||
|setRequestInterceptor|拦截请求函数|(config)=>config|
|setResponseInterceptor|拦截响应函数|(config)=>config|
|use|切换底层请求函数，默认底层是fetch，use(自己封装的请求函数)。见下面示例||
|requestControlls|关闭请求，可关闭单个请求或全部请求||

**createCacheRequestor**
|属性|说明|默认值|
|:---|:---|:---|
|key|缓存键生成函数,可自定义函数，或默认使用hash||
|persist|是否持久化本地缓存,默认内存缓存,默认使用内存|false|
|duration|缓存时长(毫秒)|3600000|
|isValid|自定义缓存有效性校验函数||

**createIdemportentRequestor**
|参数|说明|默认值|
|:---|:---|:---|
|getKey|选择将强求参数转为JSON字符串,或默认使用hash|false|

**createParalleRequestor**
|参数|说明|默认值|
|:---|:---|:---|
|maxCount|最大并发数|4|

**createRetryRequestor**
|参数|说明|默认值|
|:---|:---|:---|
|maxCount|最大重试次数|5|
|duration|重试间隔时间(毫秒)|500|

**requestControlls**
|属性|书名|参数|
|:--|:---|:---|
|cancel|关闭单个请求|cancelKey|
|cancelAll|关闭所有请求||

## 🚴 使用

```ts
import {useRequestor} from 'rokapi'
const requestor = useRequestor()
requestor.get('/api/v1/users',{
    responseType: 'json'
})

// 或者

import {request} from 'rokapi'

request({
    url: '/api/v1/users',
    method: 'GET',
    responseType: 'json'
})

```

### 😘 缓存请求

```ts
import {createCacheRequestor} from 'rokapi'
const requestor = createCacheRequestor({
    key?: (config: RequestOptions & { url: string }) => string;//缓存键生成函数,
    persist?: boolean;//是否持久化本地缓存,默认内存缓存
    duration?: number;//缓存时长(毫秒)
    isValid?: (key: string, config: RequestOptions) => boolean; //自定义缓存有效性校验函数
})


//请求
requestor.get('/api/v1/users',{
    responseType: 'text'
}).then(res=>{
    console.log(res)
})

//测试缓存

setTimeout(()=>{
    requestor.get('/api/v1/users',{
        responseType: 'text'
    }).then(res=>{
        console.log(res)
    })
    requestor.get('/api/v1/users',{
        responseType: 'text'
    }).then(res=>{
        console.log(res)
    })
},1000)
```

### 😊 请求重试
```ts
import {createRetryRequestor} from 'rokapi'

const requestor = createRetryRequestor(4)//设置最多重试次数
requestor.get('/api/v1/users',{
    responseType: 'text'
}).then(res=>{
    console.log(res)
})

```

### 😜 请求幂等

```ts
import {createIdempotentRequestor} from 'rokapi'
const requestor = createIdempotentRequestor(
    false //生成唯一键的方式，默认hash,true 则为请求的config 的字符串，JSON.stringify(config)
)

requestor.get('/api/v1/users',{
    responseType: 'text'
}).then(res=>{
    console.log(res)
})

//测试幂等性
setTimeout(()=>{
    requestor.get('/api/v1/users',{
        responseType: 'text'
    }).then(res=>{
        console.log(res)
    })
},1000)

```

### 😰 请求并发
```ts
import {createParalleRequestor} from 'rokapi'

const requestor = createParalleRequestor(2)//设置并发数

//测试并发
Promise.all([
    requestor.get('/api/v1/users',{}),
    requestor.get('/api/v1/users',{})
    requestor.get('/api/v1/users',{})
    requestor.get('/api/v1/users',{})
    requestor.get('/api/v1/users',{})
])

```

### 🚉 请求串行

```ts
import {createSerialRequestor} from 'rokapi'
const requestor = createSerialRequestor()
//测试串行
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0').then(res => {
    console.log(1, res)
})
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0').then(res => {
    console.log(2, res)
})
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0').then(res => {
    console.log(3, res)
})
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0').then(res => {
    console.log(4, res)
})
```

### 💻 自定义底层请求

```ts
import axios from 'axios'
import type { AxiosRequestConfig, ResponseType } from 'axios'
import { use, useRequestor } from 'rokapi'

export const axiosAdapter: BaseRequestor = async (url, options) => {
    console.log('现在是axios 在执行')
    const { method, responseType, ...restOptions } = options;
    const axiosConfig: AxiosRequestConfig = {
        url,
        method: method as AxiosRequestConfig['method'],
        responseType: responseType as ResponseType,
        ...restOptions,
    }
    const response = await axios(axiosConfig);
    return response.data
}

use(axiosAdapter) //切换底层请求
const request = useRequestor() //使用自定义的底层请求

```

### 🚖 拦截器使用

```ts
import {useRequestor, setRequestInterceptor, setResponseInterceptor } from 'rokapi'

//拦截请求
setRequestInterceptor(async (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config
})
//拦截响应
setResponseInterceptor(async (res) => {
    return {...res, additionalData: 'added'}
})
'
```
### 🚫 关闭请求

```ts
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0', {
    cancelKey: 'key1'
})
request.get('http://127.0.0.1:4523/export/openapi/2?version=3.0', {
    cancelKey: 'key2'
})
setTimeout(() => {
    console.log(requestControlls.has('key1'))
    // requestControlls.cancel('key1')  关闭单个请求
    requestControlls.cancelAll() //关闭所有请求
    console.log('取消了')
}, 100)
```

