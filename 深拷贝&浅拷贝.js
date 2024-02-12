/**
 * 浅拷贝，其实只需要考虑对象类型就行了，其他的照常返回。
 * @param {any} data 
 * @returns any
 */
function clone (data) {
    // 基本类型
    if(typeof data !== 'object') {
        return data
    } else if (Array.isArray(data)) { // 分情况讨论：简单来吧，假设只有数组和普通对象
        return [...data]
    } else {
        return { ...data }
    }
}

/**
 * 深拷贝简单版本：只考虑基本类型、普通对象、数组
 * @param {*} data 
 * @returns 
 */
function deepClone(data) {
    // 基本类型直接返回
    if(typeof data !== 'object') {
        return data
    }
    // 假设只有数组和普通对象
    if(Array.isArray(data)) {
        return data.map((val) => {
            return deepClone(val)
        })
    } else {
        const obj = {}
        // Object.keys不会枚举原型上的属性
        Object.keys(data).forEach((key) => {
            obj[key] = deepClone(data[key])
        })
        return obj
    }
}

/**
 * 深拷贝：考虑循环引用版本，如果对象中有循环引用的话，那深拷贝会栈溢出，所以需要将创建过的对象保存一下
 * 使用 map 对象，保存值-值对，老引用 - 新引用。参考的文档用了 weakMap，主要是跟垃圾回收机制有关，详情看es6 文档，简化思考吧，这里就用 map 就行了
 * @param {any} data 
 * @param {Map} hashMap 
 * @returns 
 */
function deepClone(data, hashMap = new Map()) {
    // 基本类型直接返回
    if(typeof data !== 'object') {
        return data
    }

    // 判断当前对象是否被创建过，避免循环引用的问题
    if(hashMap.has(data)) {
        return hashMap.get(data)
    }

    let newData
    // 假设只有数组和普通对象
    if(Array.isArray(data)) {
        newData = []
        // 保存创建好的对象的 新-旧 映射
        hashMap.set(data, newData)
        data.forEach((val) => {
            const value = deepClone(val, hashMap)
            newData.push(value)
        })
    } else {
        newData = {}
        // 保存创建好的对象的 新-旧 映射
        hashMap.set(data, newData)
        // Object.keys不会枚举原型上的属性
        Object.keys(data).forEach((key) => {
            newData[key] = deepClone(data[key], hashMap)
        })
    }
    
    return newData
}


/**
 * 深拷贝：考虑其他类型的对象版本
 * @param {any} data 
 * @param {Map} hashMap 
 * @returns 
 */
function deepClone(data, hashMap = new Map()) {
    // 基本类型直接返回
    if(typeof data !== 'object') {
        return data
    }

    // 判断当前对象是否被创建过，避免循环引用的问题
    if(hashMap.has(data)) {
        return hashMap.get(data)
    }
    let newData = getInit(data)
    // 保存创建好的对象的 新-旧 映射
    hashMap.set(data, newData)

    // 假设只有数组和普通对象
    if(Array.isArray(data)) {
        data.forEach((val) => {
            const value = deepClone(val, hashMap)
            newData.push(value)
        })
    } else if (getTypeOf(data) === 'map') { // 判断其他类型可以用对象的 toString 方法
        data.forEach((val, key) => {
            newData.set(key, deepClone(val, hashMap))
        })
    } else if (getTypeOf(data) === 'set') {
        data.forEach((val) => {
            newData.add(deepClone(val, hashMap))
        })
    } else {
        // Object.keys不会枚举原型上的属性
        Object.keys(data).forEach((key) => {
            newData[key] = deepClone(data[key], hashMap)
        })
    }
    
    return newData
}
// 参考文档的，可以根据对象的构造函数初始化一个对象，这个方式很机智，不用关心究竟是什么类型的对象了
function getInit (target) {
    const constr = target.constructor
    return new constr()
}
// 获取所有对象的类型
function getTypeOf(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

const test = {
    a: 4,
    b: 6,
    c: [1,2,3, {
        ff: 5,
        gg: 99
    }],
    ccc: {
        gg: 99
    },
    map: new Map([
        [[1,2,3], [4,5,6]],
        [{ a: 99}, {b: 100}]
    ]),
    set: new Set([1,2,3,4,{ b: 45 }])
}
test.test = test
const test2 = deepClone(test)
console.log(test, test2, test.ccc === test2.ccc)
console.log( test2.test === test2)
console.log([...test2.map.values()][0] === [...test.map.values()][0], [...test2.map.values()][0])
