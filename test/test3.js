const MyPromise = require('../index');

const test3 = new MyPromise((resolve, reject) => {
	throw '失败';
});
console.log(test3);
