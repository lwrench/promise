const MyPromise = require('../index');
const promise = new MyPromise((resolve, reject) => {
	resolve('succ');
});

promise
	.then()
	.then()
	.then((value) => console.log(value));
