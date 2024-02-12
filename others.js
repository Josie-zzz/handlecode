/**
 * 判断数据类型，可以覆盖绝大部分的数据类型，主要用于识别不同的对象
 * @param {any} val
 * @returns {string} 类似于array、date...
 */
function typeOf(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

console.log(typeOf(new Date()))
console.log(typeOf([]))
console.log(typeOf(new RegExp()))

/**
 * 手动实现一个 new
 * @param {function} fun 
 * @param  {...any} arg 
 */
function myNew (fun, ...arg) {
    // 创建一个对象
    const obj = {}
    // 调用构造函数，改变函数的 this 指向为新的对象，并把参数传进去
    fun.apply(obj, arg)
    // 让新的对象有原型
    // es6的特性，也可以这样写，obj.__proto__ = fun.prototype
    Object.setPrototypeOf(obj, fun.prototype)
    // 最后返回新的对象
    return obj
}

function A (a, b) {
    this.a = a
    this.b = b
}
A.prototype.add = function () {
    return `add: ${this.a + this.b}`
}

const obj = myNew(A, 1, 8)
console.log(obj.add(), obj, obj.__proto__, Object.getPrototypeOf(obj) === A.prototype)

/**
 * 手写实现instanceof关键字
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
 * 数组扁平化
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

// 拍平至一层
function flatOne (data) {
    if(Array.isArray(data)) {
        return data.reduce((pre, curt) => {
            return pre.concat(flatOne(curt))
        }, [])
    }
    return data
}
console.log(flatOne([1,2,[2,3, [4,5, [9, 9, [10, 10]]]]], 3), 'flatOne')