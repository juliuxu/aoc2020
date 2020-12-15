import { test, readInput } from '../utils/index';

type Line = number;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split(',').map(Number);
};

const input = prepareInput(readInput());

function findIndexReverse<T>(l: T[], value: T) {
  for (let i = l.length - 1; i >= 0; i -= 1) {
    if (l[i] === value) return i;
  }
  return -1;
}

const genChain = (start: number[], n: number) => {
  const l = Array(n);
  start.forEach((v, i) => {
    l[i] = v;
  });

  const valueToIndex: Record<number, number[]> = {};
  start.forEach((v, i) => {
    valueToIndex[v] = [i];
  });

  for (let i = start.length; i < n; i += 1) {
    const lastValue = l[i - 1];
    const lastIndex1 = i - 1;
    // const lastIndex2 = findIndexReverse(l.slice(0, lastIndex1), lastValue);
    const lastIndex2 = valueToIndex[lastValue]?.[1] ?? -1;

    const nextValue = lastIndex2 === -1 ? 0 : lastIndex1 - lastIndex2;

    l[i] = nextValue;

    if (nextValue in valueToIndex) {
      valueToIndex[nextValue].unshift(i);
    } else {
      valueToIndex[nextValue] = [i];
    }
  }
  return l;
};

const goA = (input: Input, n = 2020) => {
  const l = genChain(input, n);
  return l[n - 1];
};

const getValue = (start: number[], n: number) => {
  const d: Record<number, number> = {};
  start.forEach((x, i) => {
    d[x] = i;
  });

  let lastIndex = start.length - 1;
  let lastValue = start[lastIndex];
  for (let i = start.length; i < n; i += 1) {
    let nextValue = 0;
    // Check if last value was spoken before
    if (lastValue in d) {
      nextValue = lastIndex - d[lastValue];
    } else {
      nextValue = 0;
    }

    d[lastValue] = lastIndex;

    lastIndex = i;
    lastValue = nextValue;

    if (i % 1000000 === 0) {
      console.log('on i', i);
    }
  }
  return lastValue;
};

const goB = (input: Input, n = 30000000) => {
  return getValue(input, n);
};

/* Tests */

test(genChain([0, 3, 6], 10), [0, 3, 6, 0, 3, 3, 1, 0, 4, 0]);
test(goA(prepareInput(`1,3,2`)), 1);
test(goA(prepareInput(`2,1,3`)), 10);
test(goA(prepareInput(`1,2,3`)), 27);
test(goA(prepareInput(`2,3,1`)), 78);
test(goA(prepareInput(`3,2,1`)), 438);
test(goA(prepareInput(`3,1,2`)), 1836);

test(goB(prepareInput(`1,3,2`), 2020), 1);
test(goB(prepareInput(`2,1,3`), 2020), 10);
test(goB(prepareInput(`1,2,3`), 2020), 27);
test(goB(prepareInput(`2,3,1`), 2020), 78);
test(goB(prepareInput(`3,2,1`), 2020), 438);
test(goB(prepareInput(`3,1,2`), 2020), 1836);

// test(goB(prepareInput(`0,3,6`)), 175594);
// test(goB(prepareInput(`1,3,2`)), 2578);
// test(goB(prepareInput(`2,1,3`)), 3544142);
// test(goB(prepareInput(`1,2,3`)), 261214);
// test(goB(prepareInput(`2,3,1`)), 6895259);
// test(goB(prepareInput(`3,2,1`)), 18);
// test(goB(prepareInput(`3,1,2`)), 362);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
