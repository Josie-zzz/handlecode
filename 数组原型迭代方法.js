/**
 * forEach 方法
 * @param {function} callback 
 * @param {any} thisArg 
 */
Array.prototype._forEach = function (callback, thisArg) {
    for(let i = 0; i < this.length; i ++) {
        callback.call(thisArg, this[i], i, this)
    }
}

const arr = [1,2,3,4]
arr._forEach((value, key, arr) => {
    console.log(value, key, arr.length)
})

/**
 * map 方法
 * @param {function} callback 
 * @param {any} thisArg 
 */
Array.prototype._map = function(callback, thisArg) {
    const data = []
    for(let i = 0; i < this.length; i ++) {
        data.push(callback.call(thisArg, this[i], i, this))
    }
    return data
}
console.log(arr._map((value, key, arr) => {
    return `${key}-${value}`
}))

/**
 * filter 方法
 * @param {function} callback 
 * @param {any} thisArg 
 */
Array.prototype._filter = function(callback, thisArg) {
    const data = []
    for(let i = 0; i < this.length; i ++) {
        const pass = callback.call(thisArg, this[i], i, this)
        if (pass) {
            data.push(this[i])
        }
    }
    return data
}
console.log(arr._filter((value, key, arr) => {
    return value > 2
}))
console.log(arr._filter((value, key, arr) => {
    return value > 30
}))

/**
 * reduce 方法
 * @param {function} callback 
 * @param {any} init 
 */
Array.prototype._reduce = function(callback, init) {
    if(!this.length) {
        throw new Error('数组不可以为空')
    }
    let preVal = init !== undefined ? init : this[0]
    let i = init !== undefined ? 0 : 1
    for(; i < this.length; i ++) {
        preVal = callback(preVal, this[i], i, this)
    }
    return preVal
}

console.log(arr._reduce((a, b, arr) => {
    return a + b
}))
console.log([1, 2]._reduce((a, b, arr) => {
    return a + b
}, 100))
console.log([1]._reduce((a, b, arr) => {
    return a + b
}))

/**
 * some 方法
 * @param {function} callback 
 * @param {any} thisArg 
 */
Array.prototype._some = function(callback, thisArg) {
    for(let i = 0; i < this.length; i ++) {
        const bol = callback.call(thisArg, this[i], i, this)
        if (bol) {
            return true
        }
    }
    return false
}

console.log(arr._some((val, i) => {
    console.log('_some', val)
    return val > 10
}))

/**
 * every 方法，和 some 相反
 * @param {function} callback 
 * @param {any} thisArg 
 */
Array.prototype._every = function(callback, thisArg) {
    for(let i = 0; i < this.length; i ++) {
        const bol = callback.call(thisArg, this[i], i, this)
        if (!bol) {
            return false
        }
    }
    return true
}
console.log(arr._every((val, i) => {
    console.log('_every', val)
    return val > 0
}))