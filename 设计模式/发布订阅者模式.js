// 订阅-发布中心
class EventCenter {
    constructor() {
        this.subscribers = {}
    }

    // 订阅某个事件
    subscribe(event, callback) {
        if(!this.subscribers[event]) {
            this.subscribers[event] = new Set([callback])
        } else {
            this.subscribers[event].add(callback)
        }
    }

    // 取消某个订阅
    unsubscribe(event, callback) {
        if(this.subscribers[event] && this.subscribers[event].has(callback)) {
            this.subscribers[event].delete(callback)
        }
    }

    // 事件被触发，通知相关订阅者
    notify(event, data) {
        if(this.subscribers[event] && this.subscribers[event].size) {
            this.subscribers[event].forEach(cb => {
                cb(data)
            })
        }
    }
}

// 测试
const center = new EventCenter()
const obj = {
    'event1': [(data) => {
        console.log('event1-1', data)
    }, (data) => {
        console.log('event1-2', data)
    }],
    'event2': [(data) => {
        console.log('event2-1', data)
    }, (data) => {
        console.log('event2-2', data)
    }],
}

Object.entries(obj).forEach(([key, value]) => {
    value.forEach(cb => {
        center.subscribe(key, cb)
    })
})
console.log(center)
center.notify('event1', '一个神秘的邮件！！')
center.notify('event2', '猜猜我是谁')
center.unsubscribe('event2', obj.event2[0])
center.unsubscribe('event1', obj.event1[1])
center.notify('event1', '啥也没有')
center.notify('event2', '居居')