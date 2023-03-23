const MyPromise = require('../index');

const test1 = new MyPromise((resolve, reject) => {
	resolve('成功');
});
console.log(test1); // MyPromise { PromiseState: 'fulfilled', PromiseResult: '成功' }

const test2 = new MyPromise((resolve, reject) => {
	reject('失败');
});
console.log(test2); // MyPromise { PromiseState: 'rejected', PromiseResult: '失败' }
