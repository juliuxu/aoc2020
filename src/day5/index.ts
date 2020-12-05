import { test, readInput } from "../utils/index"

// where F means "front", B means "back", L means "left", and R means "right".
type FB = 'F' | 'B'
type RL = 'R' | 'L'
// type UD = 'U' | 'D' 
type Line = [
  FB[],
  RL[]
];
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput
    // .replace(/[FR]/gi, 'U')
    // .replace(/[BL]/gi, 'D')
    .split('\n').map(x => x.split('')).map(x => ([
      x.slice(0, 7) as FB[],
      x.slice(7) as RL[],
    ]))
}

const input = prepareInput(readInput())

const binarySearch = (low: number, high: number, inx: FB[] | RL[]) => {
  if (inx.length === 0) return low;

  if (inx[0] === 'F' || inx[0] === 'L') {
    // Go lower
    const diff = Math.floor((high - low) / 2)
    return binarySearch(low, high - diff, inx.slice(1))
  } else {
    // Go upper
    const diff = Math.ceil((high - low) / 2)
    return binarySearch(low + diff, high, inx.slice(1))
  }
}

const calc = ([rowX, columnX]) => {
  const row = binarySearch(0, 127, rowX)
  const column = binarySearch(0, 7, columnX)
  return [row, column, (row * 8) + column]
}
const goA = (input: Input) => {
  // console.log(input)
  return input.map(calc).map(x => x[2]).reduce((a, b) => Math.max(a, b))
}

const goB = (input: Input) => {
  const seatIds = input.map(calc).map(x => x[2])
  const sorted = seatIds.sort((a, b) => a - b)

  let previous = sorted[0] - 1;
  for (const n of sorted) {
    if (n !== previous + 1) {
      return previous + 1;
    }
    previous = n;
  }

  return sorted
}

/* Tests */

// test()
/*
BFFFBBFRRR: row 70, column 7, seat ID 567.
FFFBBBFRRR: row 14, column 7, seat ID 119.
BBFFBBFRLL: row 102, column 4, seat ID 820.
*/
test(calc(prepareInput('BFFFBBFRRR')[0]), [70, 7, 567])
test(calc(prepareInput('FFFBBBFRRR')[0]), [14, 7, 119])
test(calc(prepareInput('BBFFBBFRLL')[0]), [102, 4, 820])

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
