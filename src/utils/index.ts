import { test } from "./test"
import { readInput } from "./readInput"

export const sum = (numbers: number[]) => numbers.reduce((acc, x) => acc + x, 0)
export const multiply = (numbers: number[]) => numbers.reduce((acc, x) => acc * x, 1)
export const max = (numbers: number[]) => numbers.reduce((a, b) => Math.max(a, b))

export function memo<A, B>(f: (...args: A[]) => B): (args: A) => B {
  const d: Record<string, B> = {};
  return (...args: A[]) => {
    const key = JSON.stringify(args)
    if (!(key in d)) d[key] = f(...args);
    return d[key];
  }
}

export { test, readInput }
export default { test, readInput }
