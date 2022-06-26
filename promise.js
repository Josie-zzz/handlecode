/**
 * 手写一个考虑比较周全的promise
 */

// 定义三个状态常量
/** 待决定状态（初始状态） */
const PENDING = 'pending'
/** 成功的状态 */
const FULFILLED = 'fulfilled'
/** 失败的状态 */
const REJECTED = 'rejected'

/** 这里判断和处理then的返回值，他可能是正常的对象，也可能是一个promise */
const resolvePromise = (promise2, returnValue, resolve, reject) => {
    if (promise2 === returnValue) {
        //总之是个报错的信息就行
        reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    // 下面简化一下，文章里的逻辑看的不是很明白，很懵逼，下面自己来写下得了

    // 如果这个返回值是promise的实例，就需要将这个promise的成功或者失败的参数传递到下一个then的参数中（就是promise2），注意第二个then是前面的then返回的新的promise2
    // 那么如何传给下一个then的回调函数呢？
    // 其实就是在这里调用then可以拿到这个promise成功或者失败的值，然后传递给promise2 的resolve or reject，这样promise2的then就会拿到这些值
    if (returnValue instanceof Promise) {
        // returnValue.then((value) => resolve(value), reason => reject(reason)) 简写如下：
        returnValue.then(resolve, reject)
    } else {
        // 如果只是简单的对象或者简单类型，就直接调用resolve，将值传递下去就行了
        resolve(returnValue)
    }
}

class Promise {
    /** 参数executor译为执行器，需要立即执行的函数 */
    constructor(executor) {
        /** 当前promise的状态 */
        this.status = PENDING
        /** 储存成功的值 */
        this.value = undefined
        /** 储存失败的原因 */
        this.reason = undefined
        /** 储存成功的回调函数 */
        this.onFulfilledCallbacks = []
        /** 储存失败的回调函数 */
        this.onRejectedCallbacks = []

        /**
         * 改变当前promise的状态为成功，并且储存成功的值，调用成功的回调函数
         * 需要判断当前状态，只有待决定时才能执行这些，因为promise的状态只能被改变一次，下面同理
         * @param {any} value 成功的值
         */
        const resolve = value => {
            // ------扩展方法，当value为一个promise的时候
            // 这里是一个递归调用，如果是一个promise的话，这里的resolve的参数为这个promise的resolve的参数，能拿到这个参数当然要去then里面拿了
            // 不要被return扰乱视线，它只是为了结束递归
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            // ------

            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value

                // 依次遍历执行成功的回调函数
                this.onFulfilledCallbacks.forEach(callback => callback())
            }
        }

        /**
         * 改变当前promise的状态为失败，并且储存失败的原因，调用失败的回调函数
         * @param {any} reason 失败的值
         */
        const reject = reason => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason

                // 依次遍历执行失败的回调函数
                this.onRejectedCallbacks.forEach(callback => callback())
            }
        }

        // 立即执行executor函数，我们的业务代码，改变状态的逻辑都在这里面
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then(onFulfilled, onRejected) {
        // 防止回调函数没传的情况
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected =
            typeof onRejected === 'function'
                ? onRejected
                : err => {
                      throw err
                  }

        //为了满足then的链式调用，所以then需要返回一个新的promise，同样这个给构造函数的参数会被立即执行
        // 里面的代码都用try-catch包了起来，防止出错，但也降低了可读性
        const promise2 = new Promise((resolve, reject) => {
            // 如果调用then的时候状态是成功，例如反复调用一个状态已经更新的promise对象，下面失败也一样
            if (this.status === FULFILLED) {
                //注意这里用setTimeout 就纯粹是为了让resolvePromise拿到promise2的值，然后resolvePromise这里需要判断成功的结果不能是自己，
                //因为新的promise2不可以等自己，这样就会死循环，自己等自己成功，这是有问题的。
                //如果不加setTimeout那么在执行resolvePromise这个函数的时候promise2为undefined，这很好理解，因为执行这个函数的时候，构造函数还没结束，所以promise2还没接收到返回值
                //真正的promise应该是用来另一种代替setTimeout的方式解决的问题，因为promise是微任务，setTimeout是宏任务
                setTimeout(() => {
                    try {
                        let returnValue = onFulfilled(this.value)

                        // 处理这个返回值，因为这个返回值可能又是一个promise
                        resolvePromise(promise2, returnValue, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }

            //简写了，和上面类似
            if (this.status === REJECTED) {
                let returnValue = onRejected(this.reason)
                resolvePromise(promise2, returnValue, resolve, reject)
            }

            //如果调用then的时候状态是待决定，需要将成功的回调函数和失败的回调函数先存起来，等待状态变化的时候一一调用
            //这里也简写了，和上面类似
            if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    const returnValue = onFulfilled(this.value)
                    resolvePromise(promise2, returnValue, resolve, reject)
                })

                this.onRejectedCallbacks.push(() => {
                    const returnValue = onRejected(this.reason)
                    resolvePromise(promise2, returnValue, resolve, reject)
                })
            }
        })

        return promise2
    }

    //catch就是基于then的
    catch(callback) {
        this.then(null, callback)
    }

    //这个finally是不管 Promise 对象最后状态如何，都会执行的操作
    // 有两个点需要注意：
    // 1. finally 的回调函数不接受参数
    // 2. finally需要透传前面前面返回的参数
    finally(callback) {
        return this.then(
            //其实可以看到这一坨是同步执行的：Promise.resolve(callback())
            //主要在于这个then，这里返回的是一个promise，由上面的原理可以知道，这个then返回的value可以被下一个then接收到
            //有点绕，需要多多理解下
            value => Promise.resolve(callback()).then(() => value),
            reason =>
                Promise.resolve(callback()).then(() => {
                    throw reason
                })
        )
    }

    //这两个静态方法其实蛮简单，重点在于扩展 constructor 中的 resolve, reject 这俩方法
    // 这是因为value、reason很可能会是一个promise
    static resolve(value) {
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    // 用于处理并发的promise问题，接收一个数组，这里暂时模拟只接收数组的情况，官方提供还可以接收有Iterator接口的
    static all(promiseArr) {
        if (!Array.isArray(promiseArr)) {
            return console.error('不是一个数组')
        }

        /** 储存所有结果的数组，注意这里的结果是按照promiseArr的顺序传的 */
        let resultArr = []
        /** 记录改变状态的promise数量 */
        let index = 0

        // 返回一个新的promise
        return new Promise((resolve, reject) => {
            promiseArr.forEach((p, i) => {
                // 调用这个Promise.resolve方法也兼容非promise实例的情况，前面也看到如果是promise，则在resolve中会调用then，如果有错误也会抛出
                Promise.resolve(p).then(
                    value => {
                        //储存成功的结果
                        resultArr[i] = value
                        // 记录成功的数量，加一
                        index++

                        // 如果所有的状态都成功了，就改变这个all返回的这个promise状态为成功
                        if (index === promiseArr.length) {
                            resolve(resultArr)
                        }
                    },
                    err => {
                        // 只要有一个错，就返回第一个报错的
                        reject(err)
                    }
                )
            })
        })
    }

    static race(promiseArr){
        if (!Array.isArray(promiseArr)) {
            return console.error('不是一个数组')
        }

        return new Promise((resolve, reject) => {
            promiseArr.forEach((p, i) => {
                Promise.resolve(p).then(resolve, reject)
            })
        })
    }

    static allSettled(promiseArr){
        if (!Array.isArray(promiseArr)) {
            return console.error('不是一个数组')
        }

        return  new Promise((resolve, reject) => {
            /** 储存所有结果的数组，不管成功还是失败，但是里面的数据是有个格式的 */
            let resultArr = []
            /** 记录改变状态的promise */
            let index = 0
            promiseArr.forEach((p, i) => {
                Promise.resolve(p).then((value) => {
                    resultArr[i] = {
                        status: 'fulfilled',
                        value,
                    }
                    index++

                    // 不可以这样判断：promiseArr.length === resultArr.length，因为如果后面的先变化，例如：resultArr[3] = ...，那么resultArr.length 就是4，但是其中有空值，从而错误的进入这个判断
                    if(index === promiseArr.length){
                        resolve(resultArr)
                    }
                }, (reason) => {
                    resultArr[i] = {
                        status: 'rejected',
                        reason,
                    }

                    if(index === promiseArr.length){
                        resolve(resultArr)
                    }
                })
            })
        })
    }

    //如果有一个成功返回那就返回它，否则等待promise 都为reject的时候才结束，注意返回的可不是所有错误的集合
    static any (promiseArr){
        if (!Array.isArray(promiseArr)) {
            return console.error('不是一个数组')
        }

        return  new Promise((resolve, reject) => {
            /** 记录错误的promise数量 */
            let index = 0

            promiseArr.forEach((p, i) => {
                Promise.resolve(p).then(resolve, (err) => {
                    index++
                    if(index == promiseArr.length){
                        reject(new AggregateError('All promises were rejected'))
                    }
                })
            })
        })
    }
}

// testing

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(
            new Promise(resolve => {
                resolve(88888)
            })
        )
    }, 1000)
    reject('dhjskh')
})

p.then(
    value => {
        console.log(value, 'value')
        return new Promise((resolve, reject) => {
            resolve(34)
        }).then(s => {
            console.log(s, 's')
            return new Promise((resolve, reject) => {
                resolve(99)
            })
        })
    },
    reason => {
        console.log(reason, 'reason')
    }
).then(v => {
    console.log(v, 'v')
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            code: 200
        })
    })
    reject('error222')
})

Promise.all([p, p2]).then((val) => {
    console.log(val, 'all')
}, err => {
    console.log(err, 'all')
})

Promise.race([p, p2]).then((val) => {
    console.log(val, 'race')
}, err => {
    console.log(err, 'race')
})

Promise.allSettled([ p, p2]).then((val) => {
    console.log(val, 'allSettled')
})

Promise.any([p, p2]).then((val) => {
    console.log(val, 'any')
}, err => {
    console.log(err, 'any')
})


