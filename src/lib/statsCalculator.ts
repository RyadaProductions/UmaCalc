

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers
} from './modifierTypes.js';

import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    type Strategy
} from './constants.js'

export function getMoodModifier(
    selectedMood: string
): number {
    const key = selectedMood.toLowerCase();
    const moodModifier = moodModifiers[key];
    if (moodModifier == null) throw new Error(`Unknown mood "${selectedMood}"`);
    return moodModifier;
}

export function getWeatherModifier(
    selectedSurface: string,
    selectedCondition: string,
): SurfaceAndWeatherModifiers {
    const surfaceMap = surfaceModifiers[selectedSurface.toLowerCase()];
    if (!surfaceMap) throw new Error(`Unknown surface "${selectedSurface}"`);
    const surfaceModifier = surfaceMap[selectedCondition.toLowerCase()];
    if (!surfaceModifier) throw new Error(`Unknown condition "${selectedCondition}"`);
    return surfaceModifier;
}

export function getDistanceAptitudeModifiers(
    distance: string,
    distanceAptitudes: Record<string, string>,
): DistanceAptitudeModifiers {
    const aptitude = distanceAptitudes[distance.toLowerCase()];
    if (!aptitude) throw new Error(`No aptitude for distance "${distance}"`);
    const modifiers = distanceAptitudeModifiers[aptitude.toLowerCase()];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${aptitude}"`);
    return modifiers;
}

export function getStrategyAptitudeModifiers(
    strategy: Strategy,
    strategyAptitudes: Record<string, string>
): DistanceAptitudeModifiers {
    const aptitude = strategyAptitudes[strategy.toLowerCase()];
    if (!aptitude) throw new Error(`No aptitude for strategy "${strategy}"`);
    const modifiers = distanceAptitudeModifiers[aptitude.toLowerCase()];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${aptitude}"`);
    return modifiers;
}

// Calculation for actual speed:
// (SpeedStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier^2
export function calculateFinalSpeed(
    baseSpeed: number,
    moodModifier: number,
    weatherModifier: SurfaceAndWeatherModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return round((baseSpeed * moodModifier + weatherModifier.speed) * distanceModifier.speed ** 2);
}

// Calculation for actual stamina:
// StaminaStat * MoodModifier
export function calculateFinalStamina(
    baseStamina: number,
    moodModifier: number
): number {
    return round(baseStamina * moodModifier);
}

// Calculation for actual power:
// (PowerStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier
export function calculateFinalPower(
    basePower: number,
    moodModifier: number,
    weatherModifier: SurfaceAndWeatherModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return round((basePower * moodModifier + weatherModifier.power) * distanceModifier.acceleration);
}

// Calculation for actual guts:
// GutsStat * MoodModifier
export function calculateFinalGuts(
    baseGuts: number,
    moodModifier: number
): number {
    return round(baseGuts * moodModifier);
}

// Calculation for actual wit:
// (WitStat * MoodModifier) * StrategyAptitude
export function calculateFinalWit(
    baseWit: number,
    moodModifier: number,
    strategyAptitude: number
): number {
    return round((baseWit * moodModifier) * strategyAptitude);
}

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