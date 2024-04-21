// 有一些版本号，讲这些版本号排序：['1.2.6', '3.6.9', '9.8.10', '1.3.8', '1.2.20', '9.10.10', '3.6.30']
// 当时面试写的时候，还用了三个 for 循环。。。直接就是不行，其实不应该考虑排序，排序可以用 sort，而应该考虑两个字符串如何比大小
const sortVersion = (arr) => {
    return arr.sort((a, b) => {
        const l1 = a.split('.')
        const l2 = b.split('.')
        for(let i = 0; i < l1.length; i++) {
            const x1 = Number(l1[i])
            const x2 = Number(l2[i])
            if(x1 < x2) {
                return -1
            }
            if(x1 > x2) {
                return 1
            }
        }
        return 0
    })
}

console.log(sortVersion(['1.2.6', '3.6.9', '9.8.10', '1.3.8', '1.2.20', '9.10.10', '3.6.30']))