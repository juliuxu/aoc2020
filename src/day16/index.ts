import { sum } from 'mathjs';
import { test, readInput } from '../utils/index';

type FieldRule = {
  name: string;
  ranges: [number, number][];
};
type Ticket = number[];
type Input = {
  fieldRules: FieldRule[];
  ticket: Ticket;
  nearbyTickets: Ticket[];
};

const prepareInput = (rawInput: string): Input => {
  const s = rawInput.split('\n\n');
  const fields = s[0].split('\n').map((line) => {
    const m = line.match(/^([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)$/);
    if (m === null) throw new Error(`unmatched regex ${line}`);
    return {
      name: m[1],
      ranges: [
        [Number(m[2]), Number(m[3])],
        [Number(m[4]), Number(m[5])],
      ],
    } as FieldRule;
  });

  const ticket = s[1].split('\n').slice(1)[0].split(',').map(Number);

  const nearbyTickets = s[2]
    .split('\n')
    .slice(1)
    .map((l) => l.split(',').map(Number));

  return {
    fieldRules: fields,
    ticket,
    nearbyTickets,
  };
};
const input = prepareInput(readInput());

const isValidField = (field: number, fieldRules: FieldRule[]) => {
  return fieldRules.some((rule) => {
    return rule.ranges.some(([low, high]) => {
      return field >= low && field <= high;
    });
  });
};
const goA = (input: Input) => {
  let invalidFields: number[] = [];
  for (const ticket of input.nearbyTickets) {
    const invalid = ticket.filter((x) => !isValidField(x, input.fieldRules));
    invalidFields = [...invalidFields, ...invalid];
  }
  return sum(invalidFields);
};

const isValidFieldForRule = (field: number, fieldRule: FieldRule) => {
  return fieldRule.ranges.some(([low, high]) => {
    return field >= low && field <= high;
  });
};

const goB = (input: Input) => {
  const validNearbyTickets = input.nearbyTickets.filter((ticket) =>
    ticket.every((field) => isValidField(field, input.fieldRules))
  );
  // console.log('validNearbyTickets');
  // console.log(validNearbyTickets);

  const allFieldPositions: Record<string, number[]> = {};
  for (const fieldRule of input.fieldRules) {
    // All tickets have same length
    // Find all positions for each rule all tickets are valid for
    const positions = Object.keys(validNearbyTickets[0])
      .filter((i) => {
        return validNearbyTickets.every((t) => {
          return isValidFieldForRule(t[i], fieldRule);
        });
      })
      .map(Number);

    console.log(fieldRule.name, positions);
    allFieldPositions[fieldRule.name] = positions;
  }

  // Reduce. Assume there exists rule with only one possible position
  const p = new Set<number>();
  const finalFieldPositions: Record<string, number> = {};
  while (p.size < validNearbyTickets[0].length) {
    for (const [key, values] of Object.entries(allFieldPositions)) {
      if (values.length === 1) {
        p.add(values[0]);
        finalFieldPositions[key] = values[0];
      }
      allFieldPositions[key] = values.filter((x) => !p.has(x));
    }
  }
  console.log(finalFieldPositions);

  const departureIndexes = Object.keys(finalFieldPositions)
    .filter((x) => x.startsWith('departure'))
    .map((x) => finalFieldPositions[x]);

  console.log(departureIndexes);

  return departureIndexes.map((i) => input.ticket[i]).reduce((a, b) => a * b);
};

/* Tests */

const t = prepareInput(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`);
const t2 = prepareInput(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`);
test(goA(t), 71);

// test(goB(t2), 1);
// row 0, class 1, seat 2

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
