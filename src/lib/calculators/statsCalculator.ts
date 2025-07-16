

import type {
    TrackConditionModifiers,
    DistanceAptitudeModifiers,
    Stats,
    Skills
} from '../types.js';

function calculateConditionalAmount(
    singleCircleAmount: number,
    doubleCircleAmount: number,
): number {
    return (singleCircleAmount * 40) + (doubleCircleAmount * 60);
}

// Calculation for actual speed:
// (SpeedStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier^2
function calculateRealSpeed(
    baseSpeed: number,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers,
    conditionalSkillSpeed: number
): number {
    return (baseSpeed * moodModifier + conditionModifiers.speed) * distanceModifier.speed ** 2 + conditionalSkillSpeed;
}

// Calculation for actual stamina:
// StaminaStat * MoodModifier
function calculateRealStamina(
    baseStamina: number,
    moodModifier: number,
    conditionalSkillStamina: number
): number {
    return baseStamina * moodModifier + conditionalSkillStamina;
}

// Calculation for actual power:
// (PowerStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier
function calculateRealPower(
    basePower: number,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers,
    conditionalSkillPower: number
): number {
    return (basePower * moodModifier + conditionModifiers.power) * distanceModifier.acceleration + conditionalSkillPower;
}

// Calculation for actual guts:
// GutsStat * MoodModifier
function calculateRealGuts(
    baseGuts: number,
    moodModifier: number,
    conditionalSkillGuts: number
): number {
    return baseGuts * moodModifier + conditionalSkillGuts;
}

// Calculation for actual wit:
// (WitStat * MoodModifier) * StrategyAptitude
function calculateRealWit(
    baseWit: number,
    moodModifier: number,
    strategyAptitude: number,
    conditionalSkillWit: number
): number {
    return (baseWit * moodModifier) * strategyAptitude + conditionalSkillWit;
}

export function calculateRealStats(
    rawStats: Stats,
    moodModifier: number,
    conditionModifiers: TrackConditionModifiers,
    distanceModifier: DistanceAptitudeModifiers,
    strategyAptitude: number,
    skills: Skills,
): Stats {
    const skillAll: number = calculateConditionalAmount(skills.singleCircle.all, skills.doubleCircle.all);
    const skillSpeed: number = skillAll + calculateConditionalAmount(skills.singleCircle.speed, skills.doubleCircle.speed);
    const skillStamina: number = skillAll + calculateConditionalAmount(skills.singleCircle.stamina, skills.doubleCircle.stamina);
    const skillPower: number = skillAll + calculateConditionalAmount(skills.singleCircle.power, skills.doubleCircle.power);
    const skillGuts: number = skillAll + calculateConditionalAmount(skills.singleCircle.guts, skills.doubleCircle.guts);
    const skillWit: number = skillAll + calculateConditionalAmount(skills.singleCircle.wit, skills.doubleCircle.wit);

    return {
        speed: calculateRealSpeed(rawStats.speed, moodModifier, conditionModifiers, distanceModifier, skillSpeed),
        stamina: calculateRealStamina(rawStats.stamina, moodModifier, skillStamina),
        power: calculateRealPower(rawStats.power, moodModifier, conditionModifiers, distanceModifier, skillPower),
        guts: calculateRealGuts(rawStats.guts, moodModifier, skillGuts),
        wit: calculateRealWit(rawStats.wit, moodModifier, strategyAptitude, skillWit)
    }
}