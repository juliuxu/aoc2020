import { test, readInput } from "../utils/index"

type Line = Record<string, number>;
type Input = Record<string, Line>;

const prepareInput = (rawInput: string): Input => {
  // shiny indigo bags contain no other bags.
  // mirrored olive bags contain 1 dull plum bag.
  // wavy plum bags contain 1 clear lavender bag, 2 faded brown bags.

  const bags = rawInput.split('\n').map(x => {
    const keyM = x.match(/^(\w+\s\w+)/)
    const valueM = x.split('contain')[1].matchAll(/(\d+)\s(\w+\s\w+)/gi)
    const containingBags = {}
    for (const m of valueM) {
      containingBags[m[2]] = Number(m[1])
    }
    return [keyM[1], containingBags] as [string, Line]
  })

  return bags.reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {})
}
const input = prepareInput(readInput())

// Assumes no cycles
const find = (input: Input, match: string, from: string) => {
  const inner = (current: string) => {
    if (Object.keys(input[current]).length === 0) return false;
    if (match in input[current]) return true;
    return Object.keys(input[current]).some(inner)
  }
  const result = inner(from)
  return result
}

// Not used
const inverse = (input: Input) => {
  const inversed: Input = {}
  for (const [bag, to] of Object.entries(input)) {
    // console.log(bag, to)
    for (const [reachableBag, count] of Object.entries(to)) {
      inversed[reachableBag] = { ...inversed[bag], [bag]: count }
    }
  }
  return inversed
}

const goA = (input: Input) => {
  return Object.keys(input)
    .filter(x => x !== 'shiny gold')
    .filter(x => find(input, 'shiny gold', x))
    .length
}

const getSum = (input: Input, current: string) => {
  // A bag holds itself
  let s = 1;
  for (const [key, value] of Object.entries(input[current])) {
    s += getSum(input, key) * value;
  }
  return s;
}

const goB = (input: Input) => {
  return getSum(input, 'shiny gold') - 1
}

/* Tests */

// test()
const testT = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`
const testI = prepareInput(testT);

test(goA(testI), 4)

const testT2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`

test(goB(prepareInput(testT2)), 126)
/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
