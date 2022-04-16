// @ts-check

class Fibonacci {
  *execute(number, current = 0, next = 1) {
    if (number === 0) return 0;

    yield current;
    yield* this.execute(number -1, next, current + next);
  }
}

module.exports = Fibonacci;
