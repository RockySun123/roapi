import { RequestOptions } from "../request-core";
import type { RequestMethod } from "../request-core";

type FetchRequest = (url: string, options: RequestOptions) => {
    url: string;
    options: RequestOptions;
}

const fetchMap: Record<RequestMethod, FetchRequest> = {
    'GET': (url, options) => {
        if (options.params) {
            url += '?' + new URLSearchParams(options.params).toString();
        }
        return { url, options }
    },
    'POST': (url, options) => {
        options.headers = {
            'Content-Type': 'application/json',
        }
        if (options.data) {
            options.body = JSON.stringify(options.data)
        }
        return { url, options }
    },
    'PUT': (url, options) => {
        options.headers = {
            'Content-Type': 'application/json',
        }
        if (options.params) {
            options.body = JSON.stringify(options.params)
        }
        return { url, options }
    },
    'DELETE': (url, options) => {
        if (options.params) {
            url += '?' + new URLSearchParams(options.params).toString();
        }
        return { url, options }
    },
    'PATCH': (url, options) => {
        options.headers = {
            'Content-Type': 'application/json',
        }
        if (options.data) {
            options.body = JSON.stringify(options.data)
        }
        return { url, options }
    },
}


export const fetchRequest = (method: RequestMethod, url: string, options: RequestOptions) => {
    const { responseType } = options;
    options.method = method;
    const { url: newUrl, options: newOptions } = fetchMap[method](url, options);

    return fetch(newUrl, newOptions).then((res) => {
        if (responseType === "arraybuffer") {
            return res.arrayBuffer();
        } else if (responseType === "blob") {
            return res.blob();
        } else if (responseType === "text") {
            return res.text();
        } else if (responseType === "json") {
            return res.json();
        }
    });
};

export default fetchRequest;


