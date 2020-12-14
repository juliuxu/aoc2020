import { test, readInput, sum } from '../utils/index';

type Mask = {
  op: 'Mask';
  value: string;
};
type Mem = {
  op: 'Mem';
  address: string;
  value: bigint;
};
type Line = Mask | Mem;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n').map((l) => {
    const maskM = l.match(/^mask = (.+)$/);
    const memM = l.match(/^mem\[(\d+)\] = (\d+)$/);

    if (maskM !== null) {
      return {
        op: 'Mask',
        value: maskM[1],
      };
    }
    if (memM !== null) {
      return {
        op: 'Mem',
        address: BigInt(memM[1]).toString(2).padStart(36, '0'),
        value: BigInt(memM[2]),
      };
    }
    throw new Error(`invalid line ${l}`);
  });
};
const input = prepareInput(readInput());

const readMask = (mask: string): [bigint, bigint] => {
  const orMaskS = mask.replace(/X/g, '0');
  const andMaskS = mask.replace(/X/g, '1');
  const orMask = BigInt(`0b${orMaskS}`);
  const andMask = BigInt(`0b${andMaskS}`);

  return [orMask, andMask];
};

const goA = (input: Input) => {
  const memory: Record<string, bigint> = {};

  let orMask: bigint = BigInt(0);
  let andMask: bigint = BigInt(0);
  for (const x of input) {
    if (x.op === 'Mask') {
      [orMask, andMask] = readMask(x.value);
    } else if (x.op === 'Mem') {
      memory[x.address] = x.value;
      memory[x.address] |= orMask;
      memory[x.address] &= andMask;
    }
  }

  return Object.values(memory).reduce((acc, x) => acc + x);
};

const generate = (s: string): string[] => {
  let result = '';
  const values = [];
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] !== 'X') result += s[i];
    else {
      const rest = s.slice(i + 1);
      return [
        ...generate(`0${rest}`).map((x) => `${result}${x}`),
        ...generate(`1${rest}`).map((x) => `${result}${x}`),
      ];
    }
  }
  return [result];
};

const applyMask = (address: string, mask: string) => {
  let masked = '';
  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i] === '0') masked += address[i];
    if (mask[i] === '1') masked += '1';
    if (mask[i] === 'X') masked += 'X';
  }

  return masked;
};

const goB = (input: Input) => {
  const memory: Record<string, bigint> = {};
  let mask = '';
  for (const x of input) {
    if (x.op === 'Mask') {
      mask = x.value;
    } else if (x.op === 'Mem') {
      const masked = applyMask(x.address, mask);
      const addresses = generate(masked);

      // Debug
      // console.log('mask   ', mask);
      // console.log('address', x.address);
      // console.log('masked ', masked);
      // console.log(addresses);

      addresses.forEach((address) => {
        memory[address] = x.value;
      });
    }
  }

  return Object.values(memory).reduce((acc, x) => acc + x);
};

/* Tests */

const t = prepareInput(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`);
test(goA(t), 165n);

const t2 = prepareInput(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`);
test(goB(t2), 208n);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
