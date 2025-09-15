const localServer = "http://127.0.0.1:3000"

export const api = (url: string) => {
    return fetch(localServer + url,).then(response => response.json()); // 解析 JSON 数据
}

export const getApi = (url: string, data?: any) => {
    const queryString = data
        ? Object.entries(data)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
    const finalUrl = queryString ? `${localServer}${url}?${queryString}` : `${localServer}${url}`;
    return fetch(finalUrl).then(response => response.json());
}

export const postApi = (url: string, data: any) => {
    return fetch(localServer + url, {
        method: 'POST', // 指定请求方法
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).catch(error => console.error('Error:', error));
}