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