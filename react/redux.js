function createStore (reducers) {
    // 保存状态
    let state
    // 订阅的回调函数
    let listens = []
    // 获取状态
    const getState = () => {
        return state
    }
    // 订阅函数
    const subscribe = (fun) => {
        // 将注册的回调存起来
        listens.push(fun)
        // 返回一个清除回调
        return () => {
            listens = listens.filter(v => v !== fun)
        }
    }
    // 触发状态
    const dispatch = (action) => {
        // 重新计算状态值
        state = reducers(state, action)
        // 调用所有注册的回调函数
        listens.forEach(fn => {
            fn()
        })
    }

    return {
        getState,
        subscribe,
        dispatch,
    }
}

const combineReducers = (combine) => {
    return (state = {}, action) => {
        const newState = {}
        const keys = Object.keys(combine)
        keys.forEach(key => {
            const preState = state[key]
            newState[key] = combine[key](preState, action)
        })

        return newState
    }
}

const reducer1 = (state = [], action) => {
    if (action.type === 'reducer1/add') {
        return [...state, action.payload]
    } else if (action.type === 'del') {
        return state.filter(v => v !== action.payload)
    }
    return state
}

const reducer2 = (state = [], action) => {
    if (action.type === 'reducer2/add') {
        return [...state, action.payload]
    } else if (action.type === 'del') {
        return state.filter(v => v !== action.payload)
    }
    return state
}

const reducers = combineReducers({
    reducer1,
    reducer2
})

const store = createStore(reducers)
// 添加一个订阅事件
store.subscribe(() => {
    console.log(store.getState())
})
// 触发状态的更新
store.dispatch({
    type: 'reducer1/add',
    payload: 23
})
store.dispatch({
    type: 'reducer1/add',
    payload: 25
})
store.dispatch({
    type: 'reducer2/add',
    payload: 26
})
store.dispatch({
    type: 'reducer2/del',
    payload: 23
})

