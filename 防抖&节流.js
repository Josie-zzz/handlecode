/**
 * 防抖：简单版
 * @param {function} fn 要执行的函数
 * @param {number} delay 延时的时间
 * @returns function 返回一个函数
 */
function debounce (fn, delay) {
    // 保存定时器
    let timer
    // 返回一个函数，因为此函数才是真正被调用的函数，所以接收参数
    return function(...args) {
        const self = this
        // 每次调用前清楚上一次的定时器，如果上一次没执行那刚好清除后重新计时，如果上一次执行了，就重新赋值
        clearTimeout(timer)
        // 设置定时器
        timer = setTimeout(() => {
            // 执行真正的函数，注意 this 指向和传参
            fn.apply(self, args)
        }, delay)
    }
}

/**
 * 防抖函数 - 包含立即执行版本
 * @param {function} fn 执行的函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否要立即执行【就是执行时机在一段时间的前面还是后面的问题】
 * @returns 返回一个函数
 */
const debounce2 = (fn, wait, immediate) => {
    let timer
    return function (...args) {
        // 如果计时器存在就清除
        if (timer) {
            clearTimeout(timer)
        }
        if (immediate) {
            // 如果此刻没有定时器，就执行函数
            let run = !timer
            // 每次执行这里都是注册定时器，等到 wait 时间后重置 timer
            timer = setTimeout(() => {
                timer = null
            }, wait)

            if (run) {
                fn.apply(this, args)
            }
        } else {
            // 这里相对简单
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, wait)
        }
    }
}

// 理解：debounce 返回一个函数，这个函数可以被任意时间触发
// 但是此函数的回调函数只会在函数被触发的最后一次的delay秒后执行
const fun = debounce(function(e) {
    console.log(e.target)
}, 1000)
document.addEventListener('click', fun)


/**
 * 节流简单版：不管函数触发多少次，在规定的时间间隔内回调函数只触发一次
 * @param {function} fn 要执行的函数
 * @param {number} delay 延时的时间
 * @returns function 返回一个函数
 */
function throttle (fn, delay) {
    // 初始化上一次的时间为 0
    let preTime = 0
    return function (...args) {
        // 每次调用都先拿到当前时间
        const now = Date.now()
        // 如果当前时间减去上一次调用的时间大于delay 的话，就调用回调函数
        if(now - preTime > delay) {
            fn.apply(this, args)
            // 重置上一次的时间
            preTime = now
        }
    }
}

// 节流 - 计时器版本
const throttle2 = function (fn, wait) {
    let timer
    return function(...args) {
        // timer不在才需要执行
        if(!timer) {
            // 执行函数
            fn.apply(this, args)
            // 设置定时器在 wait 时间后清楚 timer
            timer = setTimeout(() => {
                // 重置 timer
                timer = null
            }, wait)
        }
    }
}