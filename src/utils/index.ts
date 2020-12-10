import { test } from "./test"
import { readInput } from "./readInput"

export const sum = (numbers: number[]) => numbers.reduce((acc, x) => acc + x, 0)
export const multiply = (numbers: number[]) => numbers.reduce((acc, x) => acc * x, 1)
export const max = (numbers: number[]) => numbers.reduce((a, b) => Math.max(a, b))

export function memo<A extends number, B>(f: (args: A) => B): (args: A) => B {
  const d: Record<number, B> = {};
  return (args: A) => {
    if (!(args in d)) d[args] = f(args);
    return d[args];
  }
}

export { test, readInput }
export default { test, readInput }
