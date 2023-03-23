const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
	constructor(executor) {
		this.init();

		try {
			executor(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	static resolve(param) {
		if (param instanceof MyPromise) {
			return MyPromise;
		}
		return new MyPromise((resolve) => {
			resolve(param);
		});
	}

	static reject(param) {
		return new MyPromise((_, reject) => {
			reject(param);
		});
	}

	init() {
		this.PromiseStatus = PENDING;
		this.PromiseResult = undefined;

		this.onFulfilledCallbackList = [];
		this.onRejectedCallbackList = [];
	}

	resolve = (value) => {
		if (this.PromiseStatus !== PENDING) return;
		this.PromiseStatus = FULFILLED;
		this.PromiseResult = value;

		while (this.onFulfilledCallbackList.length > 0) {
			this.onFulfilledCallbackList.shift()(this.PromiseResult);
		}
	};

	reject = (error) => {
		if (this.PromiseStatus !== PENDING) return;
		this.PromiseStatus = REJECTED;
		this.PromiseResult = error;

		while (this.onRejectedCallbackList.length > 0) {
			this.onRejectedCallbackList.shift()(this.PromiseResult);
		}
	};

	then(onFulfilled, onRejected) {
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
		onRejected =
			typeof onRejected === 'function'
				? onRejected
				: (error) => {
						throw error;
				  };

		const thenPromise = new MyPromise((resolve, reject) => {
			// 这里的内容在执行器中，会立即执行
			if (this.PromiseStatus === FULFILLED) {
				queueMicrotask(() => {
					try {
						const x = onFulfilled(this.PromiseResult);
						resolvePromise(thenPromise, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			} else if (this.PromiseStatus === REJECTED) {
				try {
					const x = onRejected(this.PromiseResult);
					resolvePromise(thenPromise, x, resolve, reject);
				} catch (error) {
					reject(error);
				}
			} else if (this.PromiseStatus === PENDING) {
				this.onFulfilledCallbackList.push(() => {
					queueMicrotask(() => {
						try {
							const x = onFulfilled(this.PromiseResult);
							resolvePromise(thenPromise, x, resolve, reject);
						} catch (error) {
							reject(error);
						}
					});
				});
				this.onRejectedCallbackList.push(() => {
					queueMicrotask(() => {
						try {
							const x = onRejected(this.PromiseResult);
							resolvePromise(thenPromise, x, resolve, reject);
						} catch (error) {
							reject(error);
						}
					});
				});
			}
		});

		return thenPromise;
	}
}

function resolvePromise(thenPromise, x, resolve, reject) {
	if (thenPromise === x) {
		return reject(new TypeError('The promise and the return value are the same'));
	}
	// 判断x是不是 MyPromise 实例对象
	if (typeof x === 'object' || typeof x === 'function') {
		if (x === null) {
			return resolve(x);
		}
		let then;
		try {
			// 把 x.then 赋值给 then
			then = x.then;
		} catch (error) {
			// 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
			return reject(error);
		}

		// 如果 then 是函数
		if (typeof then === 'function') {
			let called = false;
			try {
				then.call(
					x, // this 指向 x
					// 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
					(y) => {
						// 如果 resolvePromise 和 rejectPromise 均被调用，
						// 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
						// 实现这条需要前面加一个变量 called
						if (called) return;
						called = true;
						resolvePromise(promise, y, resolve, reject);
					},
					// 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
					(r) => {
						if (called) return;
						called = true;
						reject(r);
					}
				);
			} catch (error) {
				// 如果调用 then 方法抛出了异常 error：
				// 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
				if (called) return;

				// 否则以 error 为据因拒绝 promise
				reject(error);
			}
		}
	} else {
		// 普通值
		resolve(x);
	}
}

MyPromise.deferred = function () {
	var result = {};
	result.promise = new MyPromise(function (resolve, reject) {
		result.resolve = resolve;
		result.reject = reject;
	});

	return result;
};

module.exports = MyPromise;
