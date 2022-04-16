// @ts-check
const { deepStrictEqual, rejects } = require('assert');
const sinon = require('sinon');

const Fibonacci = require('./fibonacci');

(async () => {
  {
    const fibonacci = new Fibonacci();

    // @ts-ignore
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);

    for await (const i of fibonacci.execute(3)) {}
    deepStrictEqual(spy.callCount, 4);
  }

  {
    const fibonacci = new Fibonacci();

    // @ts-ignore
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);

    const [...results] = fibonacci.execute(5);
    // [0] -> number = 5, current = 0, next = 1
    // [1] -> number = 4, current = 1, next = 1
    // [2] -> number = 3, current = 1, next = 2
    // [3] -> number = 2, current = 2, next = 3
    // [4] -> number = 1, current = 3, next = 5
    // [5] -> number = 0, break

    const call = spy.getCall(2); // three out of six calls
    deepStrictEqual(call.args, Object.values({ number: 3, current: 1, next: 2 }));
    deepStrictEqual(results, [0, 1, 1, 2, 3]);
  }
})();
