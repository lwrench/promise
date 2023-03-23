const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {

    this.init()
    this.initBind()

    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  init() {
    this.PromiseStatus = PENDING
    this.PromiseResult = undefined

    this.onFulfilledCallbackList = []
    this.onRejectedCallbackList = []
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(value) {
    if (this.PromiseStatus !== PENDING) return
    this.PromiseStatus = FULFILLED
    this.PromiseResult = value

    while (this.onFulfilledCallbackList.length > 0) {
      this.onFulfilledCallbackList.shift()(this.PromiseResult)
    }
  }

  reject(error) {
    if (this.PromiseStatus !== PENDING) return
    this.PromiseStatus = REJECTED
    this.PromiseResult = error

    while (this.onRejectedCallbackList.length > 0) {
      this.onRejectedCallbackList.shift()(this.PromiseResult)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw(error) }

   

    const thenPromise = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.PromiseStatus === FULFILLED) {
        const x = onFulfilled(this.PromiseResult)
        resolvePromise(x, resolve, reject);
      } else if (this.PromiseStatus === REJECTED) {
        onRejected(this.PromiseResult)
      } else if (this.PromiseStatus === PENDING) {
        this.onFulfilledCallbackList.push(onFulfilled.bind(this))
        this.onRejectedCallbackList.push(onRejected.bind(this))
      }
    })

    return thenPromise
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = {
  MyPromise
}