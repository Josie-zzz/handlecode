/**
 * 1. 判断数据类型，可以覆盖绝大部分的数据类型，主要用于识别不同的对象
 * @param {any} val
 * @returns {string} 类似于array、date...
 */
function typeOf(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

console.log(typeOf(new Date()))
console.log(typeOf([]))
console.log(typeOf(new RegExp()))

/** 2. 手写call、apply、bind */
Function.prototype._call = function (context, ...args) {
    // 1. 首先确定并储存新的this对象
    if (context === null || context === undefined) {
        // context = window
        // 全局对象：浏览器是window、node环境就是global
        context = global
    } else {
        // new Object(context)、Object(context) 都可以，这俩一样【参考mdn文档】
        // 注意一点：通过这个方法后，基本类型的数据如string、number会返回他们的包装对象
        context = Object(context)
    }

    // 2. 将函数挂到这个新的this对象上面
    // 临时储存函数，这里为了避免可能的属性冲突，这里用了symbol
    const contextFun = Symbol('context fun')
    // 这里的this就是要改变this指向的函数，因为谁调用此方法this就指向谁，那么是函数调用的此方法，如：fun._call()
    context[contextFun] = this
    // 到这里为止，新的this对象上面已经有了这个方法了，那么此时调用即可，并存储返回值
    const result = context[contextFun](...args)
    // 删除此属性
    delete context[contextFun]
    // 返回执行结果
    return result
}

Function.prototype._apply = function (context, args) {
    context = [null, undefined].includes(context) ? global : Object(context)

    const contextFun = Symbol('context fun')
    context[contextFun] = this
    const result = context[contextFun](...args)
    delete context[contextFun]
    return result
}

Function.prototype._bind = function (context, ...args) {
    // 储存函数
    const fun = this
    // 返回一个新的函数，这个函数执行call即可，因为是闭包，所以可以访问到初始传参
    return function (...args2) {
        return fun._call(context, ...args, ...args2)
    }
}

Function.prototype._bindBetter = function (newThis, ...args) {
    // 储存函数
    const fun = this
    newThis = [null, undefined].includes(newThis) ? global : Object(newThis)
    // 返回一个新的函数，这个函数执行call即可，因为是闭包，所以可以访问到初始传参
    const newFun = function (...args2) {
        // 判断这个新的函数有没有被new调用，如果被new了，此刻这个新函数的this就不要变了，否则就是之前传入的新的this
        const context = this instanceof newFun ? this : newThis
        return fun._call(context, ...args, ...args2)
    }

    // 如果存在原型的话，也要继承过来，例如一些自定的类，有一串原型链，所以这一点也要考虑
    if (fun.prototype) {
        newFun.prototype = fun.prototype
    }

    return newFun
}

function sayHi(...args) {
    console.log(this, ...args)
}

sayHi._call({ name: 'ss' }, 1, 2, 3)
sayHi._apply({ name: 'ss' }, ['aa', 'ppp'])

sayHi._bind({ name: 'ss' }, 1, 2)(4, 5)
sayHi._bindBetter({ name: 'ss' }, 2)(9, 6)

/**
 * 3. 手写实现instanceof关键字
 * @param {object} obj 任何一个对象
 * @param {function} constr 构造函数
 * @returns {boolean}
 */
function _instanceof(obj, constr) {
    const prototype = constr.prototype
    let pointer = Object.getPrototypeOf(obj)

    while (pointer !== null) {
        if (pointer === prototype) {
            return true
        } else {
            pointer = Object.getPrototypeOf(pointer)
        }
    }

    return false
}

class Father {}
class Son extends Father {}

const father = new Father()
const son = new Son()

console.log(_instanceof([], Array))
console.log(_instanceof(father, Father), _instanceof(father, Array))
console.log(_instanceof(son, Father), son instanceof Father)


/**
 * 4. 手写深拷贝
 * @param {*} data 要复制的数据
 * @param {*} map 创建一个map实例用来记录新建过的引用（可以没有这一步）
 * @returns 一个新的复制过的对象
 */
function deepClone (data, map = new Map()) {
    if(typeof data == 'object' && data !== null) {
        // 检查循环引用，如果已经存在就返回之前创建过的
        if(map.get(data)) {
            return data
        }
        const copyObj = Array.isArray(data) ? [] : {}
        map.set(data, copyObj)
        for(let key in data) {
            // 原型上不考虑
            if(Object.prototype.hasOwnProperty.call(data, key)) {
                copyObj[key] = deepClone(data[key], map)
            }
        }
        return copyObj
    }

    return data
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
}
test.test = test
const test2 = deepClone(test)
console.log(test2.c[3] === test.c[3], test2)


/**
 * 5. 数组扁平化
 * @param {*} data 扁平化的数组
 * @param {*} deep 想要铺平的层级
 * @returns 
 */
function flat (data, deep) {
    if (deep && deep != 0 && data.length) {
        return data.reduce((pre, curt) => {
            return pre.concat(flat(curt, deep - 1))
        }, [])
    }
    
    return data
}
console.log(flat([1,2,[2,3, [4,5, [9, 9, [10, 10]]]]], 3))