import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string): Line[] => rawInput.split('\n')
  .map(x => x.split(' ')).map(([a, b, c]) => ({
    min: Number(a.split('-')[0]),
    max: Number(a.split('-')[1]),
    letter: b[0],
    pw: c
  }))

const input = prepareInput(readInput())

interface Line {
  min: number;
  max: number;
  letter: string;
  pw: string;
}

const isValidA = (line: Line) => {
  const count = line.pw.split('').filter(c => c === line.letter).length;
  return line.min <= count && count <= line.max;
}

const goA = (input: Line[]) => {
  return input.filter(isValidA).length
}

const isValidB = (line: Line) => {
  if (line.min > line.pw.length || line.max > line.pw.length) return false
  const first = line.pw[line.min - 1] === line.letter
  const second = line.pw[line.max - 1] === line.letter
  console.log(first, second)
  return !(first && second) && (first || second)
}

const goB = (input: Line[]) => {
  return input.filter(isValidB).length
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
