# rokapi 
![rokapi](https://img.shields.io/badge/rokapi-v0.04-green
)
## 📖 简介

✅ 可自定义底层请求的封装，包括 请求重试、请求缓存、请求幂等、请求串行、请求并发

## 🎁 安装

```bash
npm install rokapi
pnpm install rokapi
yarn add rokapi
```

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




