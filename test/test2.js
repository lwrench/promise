const { MyPromise } = require('../index')

const test2 = new MyPromise((resolve, reject) => {
  // 只以第一次为准
  resolve('成功')
  reject('失败')
})
console.log(test2)