import { test, readInput, memo } from "../utils/index"

type Line = number;
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n').map(Number)
}
const input = prepareInput(readInput())

const goA = (input: Input) => {
  const sorted = input.slice().sort((a, b) => a-b);
  const sorted2 = [...sorted, sorted[sorted.length-1] + 3]
  let ones = 0;
  let threes = 0;
  let last = 0;
  for (const x of sorted2) {
    if (x - last === 1) ones +=1
    if (x - last === 3) threes +=1
    last = x;
  }
  return [ones, threes, ones*threes]
}

const getPossibleJumps = (input: Input, i: number) => {
  let result = 0;
  if (i < input.length && input[i+1] - input[i] === 1) result += 1;
  if (i < input.length && input[i+1] - input[i] === 2) result += 1;
  if (i < input.length && input[i+1] - input[i] === 3) result += 1;

  if (i+2 < input.length && input[i+2] - input[i] === 1) result += 1;
  if (i+2 < input.length && input[i+2] - input[i] === 2) result += 1;
  if (i+2 < input.length && input[i+2] - input[i] === 3) result += 1;

  if (i+3 < input.length && input[i+3] - input[i] === 1) result += 1;
  if (i+3 < input.length && input[i+3] - input[i] === 2) result += 1;
  if (i+3 < input.length && input[i+3] - input[i] === 3) result += 1;
  return result
}

const canJump = (to, from, s: number[]) => {
  if (to >= s.length) return false;
  const diff = s[to] - s[from];
  return (diff === 1 || diff === 2 || diff === 3)
}

const goB = (input: Input) => {
  const sorted = input.slice().sort((a, b) => a-b);
  const sorted2 = [0, ...sorted, sorted[sorted.length-1] + 3]

  console.log(sorted2)

  const inner = memo((i: number) => {
    if (i >= input.length) return 1;
    let acc = 0;
    if (canJump(i+1, i, sorted2)) acc += inner(i+1);
    if (canJump(i+2, i, sorted2)) acc += inner(i+2);
    if (canJump(i+3, i, sorted2)) acc += inner(i+3);

    return acc;
  })

  // let acc = 1;
  // for (let i = 0;i<sorted2.length;i++) {
  //   console.log('on', sorted2[i])
  //   if (i+1 >= sorted2.length) break;
  //   let multiplier = getPossibleJumps(sorted2, i);

  //   console.log('acc', acc)
  //   console.log(`possible jumps from ${sorted2[i]}: ${multiplier}`)
  //   acc += multiplier
  // }

  return inner(0)
}

/* Tests */
const t = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`
test(goA(prepareInput(t)), [22, 10, 22*10])
const t2 = `16
10
15
5
1
11
7
19
6
12
4`
test(goA(prepareInput(t2)), [7, 5, 7*5])

test(goB(prepareInput(t2)), 8);
test(goB(prepareInput(t)), 19208);


/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
