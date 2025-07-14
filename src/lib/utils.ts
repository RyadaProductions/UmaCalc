import { distanceMap } from "./constants";
import type { InputData, Result } from "./types";

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

export function getTrackLength(inputData: InputData): string {
    return distanceMap[parseInt(inputData.distance)];
}

export function hasEnoughStamina(result: Result): string {
    if (result.realStats.stamina + 1 < result.requiredStamina) {
        return 'Not enough stamina/guts';
    }

    if (result.realStats.stamina / result.requiredStamina < 1.1 && result.requiredStamina >= 0) {
        return 'Borderline';
    }

    return 'You have enough stamina!';
}

export function getResultColor(result: Result): string {
    if (result.realStats.stamina + 1 < result.requiredStamina) {
        return 'text-red-600';
    }

    if (result.realStats.stamina / result.requiredStamina < 1.1 && result.requiredStamina >= 0) {
        return 'text-orange-400';
    }

    return 'text-green-600';
}