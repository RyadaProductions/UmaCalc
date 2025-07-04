/**
 * Round (halfs go away from zero).
 *
 * @param value    The number to round
 * @param decimals How many places after the decimal point
 * @returns        Rounded value
 */
export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.sign(value) * Math.round(Math.abs(value) * factor) / factor;
}