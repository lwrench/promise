const MyPromise = require('../index');

const test = new MyPromise((resolve, reject) => {
	resolve('成功');
}).then(
	(res) => console.log(res),
	(err) => console.log(err)
);
