import { test, readInput } from '../utils/index';

type Face = 'N' | 'W' | 'E' | 'S';
type Move = [Face, number];
type Turn = ['L' | 'R', number];
type Forward = ['F', number];
type Line = Turn | Move | Forward;
type Input = Line[];
type Position = [number, number];

const prepareInput = (rawInput: string): Input => {
  return rawInput.split('\n').map((x) => [x[0], Number(x.slice(1))] as Line);
};

const turn = (face: Face, [lr, n]: Turn) => {
  // n is divisible by 90. 90, 180, 270, etc..
  const t = (n / 90) % 4;

  const faceToNumber: Record<Face, number> = {
    N: 0,
    E: 1,
    S: 2,
    W: 3,
  };
  const numberToFace: Record<0 | 1 | 2 | 3, Face> = {
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W',
  };

  const sign = lr === 'L' ? -1 : 1;
  const faceNumber = faceToNumber[face];
  let turned = (faceNumber + ((sign * t) % 4)) % 4;
  if (turned < 0) turned = 4 + turned;
  // console.log(`${face} ${lr}-${n}`);
  // console.log('turn', sign, t, faceNumber, turned);
  return numberToFace[turned];
};
const move = ([x, y]: Position, [face, n]: Move): Position => {
  const faceToPath: Record<Face, [number, number]> = {
    N: [0, -1],
    E: [1, 0],
    S: [0, 1],
    W: [-1, 0],
  };
  // console.log(`move ${face} ${n}`);
  const [px, py] = faceToPath[face];
  return [x + px * n, y + py * n];
};
const compute = (
  [x, y]: Position,
  face: Face,
  [inx, n]: Line
): [Position, Face] => {
  if (inx === 'L' || inx === 'R') return [[x, y], turn(face, [inx, n])];
  if (inx === 'F') return [move([x, y], [face, n]), face];
  return [move([x, y], [inx, n]), face];
};

const input = prepareInput(readInput());

const getManhattenDistance = ([x1, y1]: Position, [x2, y2]: Position) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const goA = (input: Input) => {
  // console.log(input.filter((x) => x[0] === 'R' || x[0] === 'L'));

  let face: Face = 'E';
  let [x, y] = [0, 0];
  for (const [inx, n] of input) {
    [[x, y], face] = compute([x, y], face, [inx, n]);
  }

  const d = getManhattenDistance([0, 0], [x, y]);
  // console.log(`face(${face}) x(${x}) y(${y}) d(${d})`);

  return d;
};

const rotateWaypoint = ([wX, wY], [lr, n]: Turn): Position => {
  // n is divisible by 90. 90, 180, 270, etc..
  const t = (n / 90) % 4;
  const sign = lr === 'L' ? -1 : 1;

  // Right rotate
  // t=1 wX=10 wY=-4
  //     wX=4  wY=10

  // -n +e +s -w
  // n(0, -90) -> e(90, 0) -> s(0, 90) -> w(-90, 0) -> n(0, -90)
  // når x er positiv blir y positiv
  // når x er negativ blir y negativ
  // når y er negativ blir x positiv
  // når y er postiv blir x negativ

  const rotate = (x, y) => [y * (-1 * sign), x * (1 * sign)];

  let newX = wX;
  let newY = wY;
  for (let i = 0; i < t; i += 1) {
    [newX, newY] = rotate(newX, newY);
  }

  // Ensure 0, not -1. Stupid JS
  return [newX === 0 ? 0 : newX, newY === 0 ? 0 : newY];
};

const computeB = (
  [sX, sY]: Position,
  [wX, wY]: Position,
  [inx, n]: Line
): [Position, Position] => {
  if (inx === 'L' || inx === 'R') {
    // Rotate the waypoint wX, wY
    return [[sX, sY], rotateWaypoint([wX, wY], [inx, n])];
  }
  if (inx === 'F') {
    // Move towards the waypoint sX, wY
    return [
      [sX + n * wX, sY + n * wY],
      [wX, wY],
    ];
  }

  // Move the waypoint
  return [[sX, sY], move([wX, wY], [inx, n])];
};

const goB = (input: Input) => {
  let ship: Position = [0, 0];
  let waypoint: Position = [10, -1];
  for (const line of input) {
    [ship, waypoint] = computeB(ship, waypoint, line);
  }

  const d = getManhattenDistance([0, 0], ship);
  console.log(`ship(${ship}), waypoint(${waypoint}), distance(${d})`);

  return d;
};

/* Tests */
test(turn('E', ['R', 90]), 'S');
test(turn('E', ['R', 180]), 'W');
test(turn('E', ['R', 270]), 'N');
test(turn('E', ['R', 360]), 'E');
test(turn('E', ['L', 90]), 'N');
test(turn('E', ['L', 180]), 'W');

// Waypoint rotate
test(rotateWaypoint([10, 4], ['R', 90]), [-4, 10]);

// n(0, -90) -> e(90, 0) -> s(0, 90) -> w(-90, 0) -> n(0, -90)
test(rotateWaypoint([0, -90], ['R', 90]), [90, 0]);
test(rotateWaypoint([90, 0], ['R', 90]), [0, 90]);
test(rotateWaypoint([0, 90], ['R', 90]), [-90, 0]);
test(rotateWaypoint([-90, 0], ['R', 90]), [0, -90]);

test(rotateWaypoint([0, -90], ['L', 90]), [-90, 0]);
test(rotateWaypoint([-90, 0], ['L', 90]), [0, 90]);
test(rotateWaypoint([0, 90], ['L', 90]), [90, 0]);
test(rotateWaypoint([90, 0], ['L', 90]), [0, -90]);

console.log('more than 90 tests');
test(rotateWaypoint([0, -90], ['R', 180]), [0, 90]);
test(rotateWaypoint([0, -90], ['R', 270]), [-90, 0]);
test(rotateWaypoint([0, -90], ['R', 360]), [0, -90]);

const t = prepareInput(`F10
N3
F7
R90
F11`);
test(goA(t), 25);
test(goB(t), 286);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
