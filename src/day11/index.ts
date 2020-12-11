import { test, readInput, sum } from '../utils/index';

type State = '.' | 'L' | '#';
type Line = State[];
type Input = Line[];

const prepareInput = (rawInput: string): Input => {
  let result = rawInput.split('\n').map((x) => x.split('') as Line);

  // Pad with floor to avoid out of bounds
  result = result.map((x) => ['.', ...x, '.']);
  result = [
    Array(result[0].length).fill('.'),
    ...result,
    Array(result[0].length).fill('.'),
  ];

  return result;
};
const input = prepareInput(readInput());

const getNeighbours = ([x, y]: [number, number], input: Input) => {
  return [
    // Vertical
    input[y + 1][x],
    input[y - 1][x],

    // Horizontal
    input[y][x + 1],
    input[y][x - 1],

    // Diagonal down
    input[y + 1][x + 1],
    input[y + 1][x - 1],

    // Diagonal up
    input[y - 1][x + 1],
    input[y - 1][x - 1],
  ];
};

const tick = (input: Input, f = getNeighbours, limit = 4) => {
  return input.map((row, y) =>
    row.map((column, x) => {
      if (column === '.') return '.';
      const occupiedNeighbours = f([x, y], input).filter((x) => x === '#')
        .length;
      if (column === 'L' && occupiedNeighbours === 0) return '#';
      if (column === '#' && occupiedNeighbours >= limit) return 'L';
      return column;
    })
  );
};

const countOccupied = (input: Input) =>
  sum(input.map((row) => sum(row.map((x) => (x === '#' ? 1 : 0)))));

const goA = (input: Input) => {
  const inner = (m: Input, previousSum: number, day: number) => {
    const nextM = tick(m);
    const nextSum = countOccupied(nextM);
    if (previousSum === nextSum) return [previousSum, day];
    return inner(nextM, nextSum, day + 1);
  };
  const [occupied, day] = inner(input, countOccupied(input), 1);
  return occupied;
};

const getFirstVisibleSeat = (
  [startX, startY]: [number, number],
  [px, py]: [number, number],
  input: Input
) => {
  let x = startX + px;
  let y = startY + py;
  while (x >= 0 && x < input[0].length && y >= 0 && y < input.length) {
    if (input[y][x] !== '.') return input[y][x];

    x += px;
    y += py;
  }
  return '.';
};

const getFirstVisibleSeats = ([x, y]: [number, number], input: Input) => {
  return [
    // Vertical
    getFirstVisibleSeat([x, y], [1, 0], input),
    getFirstVisibleSeat([x, y], [-1, 0], input),

    // Horizontal
    getFirstVisibleSeat([x, y], [0, 1], input),
    getFirstVisibleSeat([x, y], [0, -1], input),

    // Diagonal right
    getFirstVisibleSeat([x, y], [1, 1], input),
    getFirstVisibleSeat([x, y], [1, -1], input),

    // Diagonal left
    getFirstVisibleSeat([x, y], [-1, 1], input),
    getFirstVisibleSeat([x, y], [-1, -1], input),
  ];
};

const goB = (input: Input) => {
  const inner = (m: Input, previousSum: number, day: number) => {
    const nextM = tick(m, getFirstVisibleSeats, 5);
    const nextSum = countOccupied(nextM);
    if (previousSum === nextSum) return [previousSum, day];
    return inner(nextM, nextSum, day + 1);
  };
  const [occupied, day] = inner(input, countOccupied(input), 1);
  return occupied;
};

/* Tests */

const t = prepareInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`);
test(goA(t), 37);
test(goB(t), 26);
/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
