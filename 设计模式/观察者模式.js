/**
 * 观察者模式
 */

// 定义一个被观察者类 -- 主体
class Subject {
    constructor() {
        // 定义一个观察者列表，为了防止重复添加，用 Set 对象
        this.observers = new Set()
    }

    // 添加订阅者，没有添加过才添加
    addObserver(obser) {
        if(!this.observers.has(obser)) {
            this.observers.add(obser)
        }
    }

    // 移除订阅者，存在就移除
    removeObserver(obser) {
        if(this.observers.has(obser)) {
            this.observers.delete(obser)
        }
    }

    // 通知所有观察者 -- 依次调用观察者的更新函数
    notify(message) {
        this.observers.forEach((obser) => {
            obser.update(message)
        })
    }
}

// 定义观察着类
class Observer {
    constructor(name) {
        // 初始化一些参数之类的
        this.name = name
    }

    // 定义更新函数，用于当被观察者变化的时候，调用的函数
    update(data) {
        console.log('this.name', this.name, data)
    }
}

// 测试
const subject = new Subject()
const obser1 = new Observer('wzj')
const obser2 = new Observer('josie')
subject.addObserver(obser1)
subject.addObserver(obser2)
let count = 1
const timer = setInterval(() => {
    if(count < 5) {
        subject.notify(`put message - 第${count}次`)
        count ++ 
    } else {
        clearInterval(timer)
    }
}, 2000)