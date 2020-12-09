import { test, readInput, sum } from "../utils/index"

type Line = number;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n').map(x => Number(x))
}
const input = prepareInput(readInput())

const isValid = (numbers: number[], n: number) => {
  for (let i = 0; i < numbers.length; i += 1) {
    for (let k = i + 1; k < numbers.length; k += 1) {
      if (numbers[i] + numbers[k] === n) return true
    }
  }
  return false;
}

const goA = (input: Input, preamble = 25) => {
  for (let i = preamble; i < input.length; i += 1) {
    if (!isValid(input.slice(i - preamble, i), input[i])) {
      return input[i]
    }
  }
  throw new Error('none')
}

const goB = (input: Input, preamble = 25) => {
  const invalidN = goA(input, preamble);

  for (let i = 0; i < input.length; i += 1) {
    for (let k = i + 1; k < input.length; k += 1) {
      const slice = input.slice(i, k)
      const s = sum(slice)
      if (s === invalidN) {
        const min = Math.min(...slice)
        const max = Math.max(...slice)
        return [min, max, min + max]
      }
    }
  }
  throw Error('none')
}

/* Tests */

const t = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`
test(goA(prepareInput(t), 5), 127)

test(goB(prepareInput(t), 5), [15, 47, 62])


/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
