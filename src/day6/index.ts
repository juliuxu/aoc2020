import { test, readInput } from "../utils/index"

type Line = string;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n\n')
}
const input = prepareInput(readInput())

const getLetters = (s: string) => {
  const d = {};
  for (const [w] of s.matchAll(/\w/gi)) {
    d[w] = true
  }
  return d;
}

const goA = (input: Input) => {
  return input.map((x) => Object.keys(getLetters(x))).map(x => x.length).reduce((a, b) => a + b)
}

const intersection = (a: {}, b: {}) => {
  const result = {};
  for (const k of Object.keys(a)) {
    if (k in b) result[k] = true
  }
  return result;
}

const getLetters2 = (s: string) => {
  const persons = s.split('\n')
  const personLetters = persons.map(getLetters)

  // Return intersection
  return personLetters.reduce(intersection)

}
const goB = (input: Input) => {
  return input.map((x) => Object.keys(getLetters2(x))).map(x => x.length).reduce((a, b) => a + b)
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
