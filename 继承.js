/** 原型链式继承 */
// 定义父类
function SuperType () {
    this.name = 'wzj'
}
// 父类原型方法
SuperType.prototype.sayName = function() {
    console.log('name: ', this.name)
}
// 定义子类
function SubType () {
    this.age = 99
}
// 让子类的原型指向父类的实例
SubType.prototype = new SuperType()
// 在定义子类原型上的属性和方法
SubType.prototype.sayAge = function() {
    console.log('age: ', this.age)
}

// 测试
const obj = new SubType()
const obj2 = new SubType()
console.log(obj, Object.getPrototypeOf(obj))
obj.sayAge()
obj.sayName()
obj.name = 'hhhhhh'
console.log(obj2.name)


/** 借用构造函数 */
// 父类
function SuperType2 (name) {
    this.name = name
}
// 子类
function SubType2(name, age) {
    // 调用父类构造函数
    SuperType2.call(this, name)
    this.age = age
}
// 测试
const obj3 = new SubType2('wzj', 24)
console.log(obj3)


/** 组合继承 */
// 定义父类
function Person (name) {
    this.name = name
}
// 定义父类原型的方法
Person.prototype.sayName = function() {
    console.log('this.name: ', this.name)
}
// 定义子类
function Son (name, age) {
    // 调用父类构造函数，复用构造函数逻辑生成实例
    Person.call(this, name)
    this.age = age
}
// 将子类的原型指针指向父类实例
Son.prototype = new Person()
// 注意constructor指针
Son.prototype.constructor = Son
// 最后定义子类原型上的方法
Son.prototype.sayAge = function() {
    console.log('this.age: ', this.name)
}

// 测试
const son = new Son('wzj', 24)
const son2 = new Son('hh', 99)
console.log(son, son2)
son.sayName()
son2.sayName()


/** 原型式继承 */
// 传入一个原型对象，返回以这个对象为原型的一个新的对象
function create(prototype) {
    // 创建一个临时的构造函数
    function F(){}
    // 将其prototype指向传入的对象
    F.prototype = prototype
    // 然后创建的实例
    return new F()
}
// 测试
const prototype = {
    name: 'wzj',
    sayName: function() {
        console.log('this.name: ', this.name)
    }
}
const object = create(prototype)
console.log(object.name)
object.sayName()


/** 寄生式继承 */
// 结合工厂函数和原型式继承，创建的对象既可以有共享属性，也可以有自己的属性
function createObject (prototype) {
    const obj = create(prototype)
    obj.age = 99
    return obj
}
const o = createObject(prototype)
console.log(o, 'o', o.name)


/** 寄生组合式继承 */
// 定义一个辅助函数，改变子类的指针
function helper (subT, superT) {
    // 创建一个以父类原型为原型的空对象
    const prototype = Object.create(superT.prototype)
    // 赋给子类，当做子类原型
    subT.prototype = prototype
    // 注意重写constructor指针，因为空对象中没有
    subT.prototype.constructor = subT
}
// 定义父类
function People (name) {
    this.name = name
}
// 父类原型上的方法
People.prototype.sayName = function() {
    console.log('this.name: ', this.name)
}
// 定义子类
function One (name, age) {
    // 调用父类构造函数，创建实例的属性
    People.call(this, name)
    this.age = age
}
// 改变子类的原型，让其继承父类
helper(One, People)
// 定义子类的方法
One.prototype.sayAge = function() {
    console.log('this.age: ', this.name)
}
// 测试
const one = new One('wzj', 33)
const one2 = new One('zzz', 888)
one.name = 'josie'
console.log(one, one2)
one.sayName()
one2.sayName()