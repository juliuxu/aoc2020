import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').map(x => Number(x))

const input = prepareInput(readInput())

const goA = (input: number[]) => {
  // Put numbers into a dict
  const dict = input.reduce((acc, number) => {
    acc[number] = true
    return acc
  }, {})

  for (const x of input) {
    let neededNumber = 2020 - x;
    if (dict[neededNumber]) {
      return [x, neededNumber, x * neededNumber]
    }
  }

  return 'none'
}

const goB = (input: number[]) => {
  // Put numbers into a dict
  const dict = input.reduce((acc, number) => {
    acc[number] = true
    return acc
  }, {})

  const sorted = input.slice().sort((a, b) => a - b)
  console.log(sorted)

  for (let a = 0; a < sorted.length; a += 1) {
    const aN = sorted[a];
    for (let b = a + 1; b < sorted.length; b += 1) {
      const bN = sorted[b]
      let cN = 2020 - aN - bN;
      if (dict[cN]) {
        return [aN, bN, cN, aN * bN * cN]
      }
    }
  }

  return
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
