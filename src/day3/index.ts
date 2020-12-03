import { test, readInput, multiply } from "../utils/index"

type Line = string;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n')
}
const input = prepareInput(readInput())

const move11 = (input: Input, x: number, y: number) => {
  return [(x + 1) % input[y].length, y + 1]
}
const move31 = (input: Input, x: number, y: number) => {
  return [(x + 3) % input[y].length, y + 1]
}
const move51 = (input: Input, x: number, y: number) => {
  return [(x + 5) % input[y].length, y + 1]
}
const move71 = (input: Input, x: number, y: number) => {
  return [(x + 7) % input[y].length, y + 1]
}
const move12 = (input: Input, x: number, y: number) => {
  return [(x + 1) % input[y].length, y + 2]
}

const isTree = (input: Input, x: number, y: number) => {
  const line = input[y];
  return line.charAt(x) === '#';
}

const goA = (input: Input, moveFn = move31) => {
  let x = 0, y = 0;
  let treeCount = 0;
  while (y < input.length) {
    treeCount += isTree(input, x, y) ? 1 : 0;
    [x, y] = moveFn(input, x, y)
  }
  return treeCount
}

const goB = (input: Input) => {
  const fs = [move11, move31, move51, move71, move12]
  const results = fs.map(f => goA(input, f))
  return [...results, multiply(results)]
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
