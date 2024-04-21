class Scheduler {
    constructor(max) {
        this.queue = []
        this.running = 0
        this.max = max
    }

    execute(promise) {
        promise.then(() => {
            this.running --
            const p = this.queue.shift()
            if(p) {
                this.execute(p())
            }
        })
    }

    add(promiseCreator) {
        return new Promise((resolve) => {
            if(this.running < this.max) {
                this.running ++
                this.execute(promiseCreator().then(resolve))
            } else {
                this.queue.push(() => promiseCreator().then(resolve))
            }
        })
    }
}

const timeout = time =>
    new Promise(resolve => {
        setTimeout(resolve, time)
    })

const scheduler = new Scheduler(2)

const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1') // 任务1
addTask(500, '2') // 任务2
addTask(300, '3') // 任务3
addTask(400, '4') // 任务4
