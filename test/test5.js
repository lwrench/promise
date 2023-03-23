const MyPromise = require('../index');

const test2 = new MyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve('成功'); // 1秒后输出 成功
		// resolve('成功') // 1秒后输出 失败
	}, 1000);
}).then(
	(res) => console.log(res),
	(err) => console.log(err)
);
