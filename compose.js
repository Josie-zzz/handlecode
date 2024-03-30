const compose = (...args) => {
    return (x) => {
        let result = x
        while(args.length) {
            const fn = args.pop()
            result = fn(result)
        }
        return result
    }
}

const fn1 = (arr) => {
    return arr.filter(v => v > 5)
}

const fn2 = (arr) => {
    return arr.map(v => `v: ${v}`)
}

const fun = compose(fn2, fn1)
console.log(fun([1,4,7,9]))