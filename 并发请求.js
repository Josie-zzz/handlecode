// 一个 url 列表，控制最大并发数就是 k，用 fetch 请求

const allFetch = (arr, k) => {
    const result = []
    let lastIndex = 0
    let success = 0

    const myFetch = (url, idx, resolve) => {
        lastIndex = idx
        // fetch(url).then((res) => {
        //     result[i] = res.json()
        //     if(lastIndex < arr.length - 1) {
        //         myFetch(arr[lastIndex], lastIndex + 1)
        //     }
        // })
        // 写成下面好测试，基本思路就是这样
        Promise.resolve(url).then((res) => {
            result[idx] = res
            success ++
            console.log(res)
            if(lastIndex < arr.length - 1) {
                myFetch(arr[lastIndex + 1], lastIndex + 1, resolve)
            }
            if(success == arr.length) {
                resolve(result)
            }
        })
    }
    return new Promise((resolve) => {
        for(let i = 0; i < arr.length; i++) {
            if(i < k) {
                myFetch(arr[i], i, resolve)
            }
        }
    })
}

const creatorFun = (time, txt) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(txt)
        }, time * 1000)
    })
}
const arr = [
    creatorFun(1, '1'),
    creatorFun(1.5, '2'),
    creatorFun(0.5, '3'),
    creatorFun(1, '4'),
    creatorFun(0.4, '5'),
    creatorFun(1.2, '6'),
    creatorFun(1, '7'),
    creatorFun(0.6, '8'),
]
allFetch(arr, 3).then(res => {
    console.log(res)
})