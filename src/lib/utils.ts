/**
 * Round "half away from zero" with trailing zero's.
 *
 * @param value    The number to round
 * @param decimals How many places after the decimal point
 * @returns        A string of the rounded value with trailing zero's or '-' when the value is 0
 */
export function round(value: number, decimals = 0): string {
  if (value === 0) {
    return '-';
  }

  const factor = 10 ** decimals;
  const rounded = Math.sign(value) * Math.round(Math.abs(value) * factor) / factor;
  return rounded.toFixed(decimals);
}