

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers
} from './modifierTypes.js';

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