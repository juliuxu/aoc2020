import { test, readInput } from '../utils/index';

type Position = number[];
type State = true | undefined;
// z,y,x e.g 0,10,-5
type InputObj = Record<string, State>;
type InputSet = Set<string>;
type Input = InputSet;

const prepareInput = (rawInput: string): Input => {
  const obj: InputObj = {};

  const z = 0;
  rawInput.split('\n').forEach((column, y) => {
    column.split('').forEach((v, x) => {
      obj[`${z},${y},${x}`] = v === '#' || undefined;
    });
  });

  // We only care about active positions AND it's neighbours
  // Since state switching is depended on number of active neighbours
  const activePositions = Object.entries(obj)
    // Filter out inactive positions, their neighbours are irrelevant
    .filter(([_, v]) => v === true)
    .map(([k]) => k);

  return new Set(activePositions);
};
const input = prepareInput(readInput());

const sToPosition = (s: string): Position => {
  return s.split(',').map(Number);
};
const positionToS = (p: Position) => {
  return p.join(',');
};

const getNeighbours3d = ([oZ, oY, oX]: Position) => {
  const neighbours: Position[] = [];
  for (let z = oZ - 1; z < oZ + 2; z += 1) {
    neighbours.push([z, oY - 1, oX - 1]);
    neighbours.push([z, oY - 1, oX]);
    neighbours.push([z, oY - 1, oX + 1]);

    neighbours.push([z, oY, oX - 1]);
    z !== oZ && neighbours.push([z, oY, oX]);
    neighbours.push([z, oY, oX + 1]);

    neighbours.push([z, oY + 1, oX - 1]);
    neighbours.push([z, oY + 1, oX]);
    neighbours.push([z, oY + 1, oX + 1]);
  }

  return neighbours;
};

const getActiveNeighbours = (
  s: string,
  current: Input,
  getNeighbours: (p: Position) => Position[]
) => {
  const count = getNeighbours(sToPosition(s)).filter((p) =>
    current.has(positionToS(p))
  ).length;

  return count;
};

const step = (current: Input, getNeighbours = getNeighbours3d): Input => {
  const candidates = new Set(
    [...current].map(sToPosition).flatMap(getNeighbours).map(positionToS)
  );

  // console.log(candidates);

  const next: Input = new Set();
  for (const s of candidates) {
    const active = getActiveNeighbours(s, current, getNeighbours);

    /*
    If a cube is active and exactly 2 or 3 of its neighbors are also active,
    the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active,
    the cube becomes active. Otherwise, the cube remains inactive.
    */
    if (current.has(s) && (active === 2 || active === 3)) {
      next.add(s);
    } else if (active === 3) {
      next.add(s);
    }
    // if (active === 3 || current[s] && active === 2) {
    //   next[s] = true
    // }
  }
  return next;
};

const goA = (input: Input, n = 6) => {
  let current = input;
  for (let i = 0; i < n; i += 1) {
    current = step(current);
  }

  return current.size;
};

// 4D
const getNeighbours4d = ([oW, oZ, oY, oX]: Position) => {
  const neighbours: Position[] = [];
  for (let w = oW - 1; w < oW + 2; w += 1) {
    for (let z = oZ - 1; z < oZ + 2; z += 1) {
      neighbours.push([w, z, oY - 1, oX - 1]);
      neighbours.push([w, z, oY - 1, oX]);
      neighbours.push([w, z, oY - 1, oX + 1]);

      neighbours.push([w, z, oY, oX - 1]);
      !(w === oW && z === oZ) && neighbours.push([w, z, oY, oX]);
      neighbours.push([w, z, oY, oX + 1]);

      neighbours.push([w, z, oY + 1, oX - 1]);
      neighbours.push([w, z, oY + 1, oX]);
      neighbours.push([w, z, oY + 1, oX + 1]);
    }
  }

  return neighbours;
};

const goB = (input: Input, n = 6) => {
  // Add the 4. dimension
  let current: Input = new Set();
  const w = 0;
  for (const v of input.values()) {
    current.add(`${w},${v}`);
  }

  for (let i = 0; i < n; i += 1) {
    current = step(current, getNeighbours4d);
  }

  return current.size;
};

/* Tests */
const t = prepareInput(`.#.
..#
###`);
test(goA(t, 1), 11);
test(goA(t), 112);

test(getNeighbours4d([0, 0, 0, 0]).length, 80);
test(goB(t), 848);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
