const fun = (a, b, c, d) => {
    return a + b + c + d
}

const curry = function(fun) {
    let len = fun.length
    const args = []
    // 利用闭包，保存参数状态
    const newFun = (par) => {
        args.push(par)
        // 判断函数参数，如果大于 1 就继续返回参数
        if(len > 1) {
            len --
            return newFun
        }
        // 如果小于等于 1 就执行这个原来的函数
        return fun(...args)
    }
    return newFun
}
const fn = curry(fun)
console.log(fn(1)(2)(3)(4))