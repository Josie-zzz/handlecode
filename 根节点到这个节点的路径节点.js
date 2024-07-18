// 类似下面多层嵌套数据结构：children 为空数组时，标明为最后一层
// 给出任意一个节点值，找到根节点到这个节点的路径节点。例如给出一个 id = 113, 找到这个 id 所属于的所有父节点的 id
var list = [
    {
        id: 1,
        children: [
            {
                id: 11,
                children: [
                    { id: 111, children: [] },
                    { id: 112, children: [] },
                    { id: 113, children: [] },
                ],
            },
            {
                id: 12,
                children: [{ id: 121, children: [] }],
            },
            {
                id: 13,
                children: [],
            },
        ],
    },
    {
        id: 2,
        children: [
            {
                id: 21,
                children: [
                    { id: 211, children: [] },
                    { id: 212, children: [] },
                    { id: 213, children: [] },
                ],
            },
            {
                id: 22,
                children: [{ id: 221, children: [] }],
            },
            {
                id: 23,
                children: [],
            },
        ],
    },
]

// 很快就写出来了，确实很简单
const findPath = (list, id) => {
    let flag = []
    // li 是待查找的列表，prefix是经历过的节点
    const findNode = (li, prefix) => {
        // 如果没有就返回 false
        if(!li || !li.length) {
            return false
        }
        // 如果存在一个就停止继续查找
        return li.some(val => {
            const path = [...prefix, val.id]
            // 比较当前 id
            if(val.id === id) {
                flag = path
                return true
            }
            return findNode(val.children, path)
        })
    }
    findNode(list, [])
    return flag
}

console.log(findPath(list, 2))
console.log(findPath(list, 113))
console.log(findPath(list, 213))