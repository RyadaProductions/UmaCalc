

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers
} from './modifierTypes.js';

import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    type Strategy
} from './constants.js';

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
export function calculateRealSpeed(
    baseSpeed: number,
    moodModifier: number,
    weatherModifier: SurfaceAndWeatherModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return (baseSpeed * moodModifier + weatherModifier.speed) * distanceModifier.speed ** 2;
}

// Calculation for actual stamina:
// StaminaStat * MoodModifier
export function calculateRealStamina(
    baseStamina: number,
    moodModifier: number
): number {
    return baseStamina * moodModifier;
}

// Calculation for actual power:
// (PowerStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier
export function calculateRealPower(
    basePower: number,
    moodModifier: number,
    weatherModifier: SurfaceAndWeatherModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return (basePower * moodModifier + weatherModifier.power) * distanceModifier.acceleration;
}

// Calculation for actual guts:
// GutsStat * MoodModifier
export function calculateRealGuts(
    baseGuts: number,
    moodModifier: number
): number {
    return baseGuts * moodModifier;
}

// Calculation for actual wit:
// (WitStat * MoodModifier) * StrategyAptitude
export function calculateRealWit(
    baseWit: number,
    moodModifier: number,
    strategyAptitude: number
): number {
    return (baseWit * moodModifier) * strategyAptitude;
}