

import type {
    TrackConditionModifiers,
    DistanceAptitudeModifiers,
    Stats
} from '../modifierTypes.js';

// Calculation for actual speed:
// (SpeedStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier^2
function calculateRealSpeed(
    baseSpeed: number,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return (baseSpeed * moodModifier + conditionModifiers.speed) * distanceModifier.speed ** 2;
}

// Calculation for actual stamina:
// StaminaStat * MoodModifier
function calculateRealStamina(
    baseStamina: number,
    moodModifier: number
): number {
    return baseStamina * moodModifier;
}

// Calculation for actual power:
// (PowerStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier
function calculateRealPower(
    basePower: number,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return (basePower * moodModifier + conditionModifiers.power) * distanceModifier.acceleration;
}

// Calculation for actual guts:
// GutsStat * MoodModifier
function calculateRealGuts(
    baseGuts: number,
    moodModifier: number
): number {
    return baseGuts * moodModifier;
}

// Calculation for actual wit:
// (WitStat * MoodModifier) * StrategyAptitude
function calculateRealWit(
    baseWit: number,
    moodModifier: number,
    strategyAptitude: number
): number {
    return (baseWit * moodModifier) * strategyAptitude;
}

export function calculateRealStats(
    rawStats: Stats,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers,
    strategyAptitude: number
): Stats {
    return {
        speed: calculateRealSpeed(rawStats.speed, moodModifier, conditionModifiers, distanceModifier),
        stamina: calculateRealStamina(rawStats.stamina, moodModifier),
        power: calculateRealPower(rawStats.power, moodModifier, conditionModifiers, distanceModifier),
        guts: calculateRealGuts(rawStats.guts, moodModifier),
        wit: calculateRealWit(rawStats.wit, moodModifier, strategyAptitude)
    }
}