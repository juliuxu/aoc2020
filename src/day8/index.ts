import { test, readInput } from "../utils/index"

type Line = [string, number];
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n').map((x, i) => {
    const m = x.match(/^(\w+) ([+-]\d+)$/)
    return [m[1], Number(m[2])]
  })
}
const input = prepareInput(readInput())

const goA = (input: Input) => {
  let acc = 0;
  const visited = {};
  let i = 0;
  while (i < input.length) {
    visited[i] = true
    const [inx, n] = input[i]
    if (inx === 'acc') {
      acc += n
      i += 1
    } else if (inx === 'jmp') {
      i += n;
    } else {
      i += 1
    }
    if (visited[i]) return [false, acc];
  }
  return [true, acc]
}

const goB = (input: Input) => {
  console.log("goB")
  for (let i = 0; i < input.length; i += 1) {
    console.log('i', i)
    const [inx, n] = input[i]
    if (inx === 'acc') continue;
    const newInx = inx === 'nop' ? 'jmp' : 'nop'
    const newInput = input.slice();
    newInput[i] = [newInx, n]

    const [didRunThrough, acc] = goA(newInput);
    if (didRunThrough) return acc;
  }
  throw new Error('none')
}

/* Tests */
const t = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`

test(goA(prepareInput(t)), [false, 5])
test(goB(prepareInput(t)), 8)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
