const mySetInterval = (callback, time) => {
    let timer = {}
    const fn = () => {
        timer.current = setTimeout(() => {
            callback()
            fn()
        }, time)
    }
    fn()
    return timer
}

const timer = mySetInterval(() => {
    console.log(11)
}, 1000)


setTimeout(() => {
    clearTimeout(timer.current)
}, 3000)
