import { test } from "./test"
import { readInput } from "./readInput"

export const sum = (numbers: number[]) => numbers.reduce((acc, x) => acc + x, 0)
export const multiply = (numbers: number[]) => numbers.reduce((acc, x) => acc * x, 1)
export const max = (numbers: number[]) => numbers.reduce((a, b) => Math.max(a, b))

export { test, readInput }
export default { test, readInput }
