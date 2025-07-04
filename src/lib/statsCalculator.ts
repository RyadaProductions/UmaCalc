

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers
} from './modifierTypes.js';

import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers
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

// Calculation for actual speed:
// (SpeedStat * MoodModifier + SurfaceAndWeatherModifier) * DistanceAptitudeSpeedModifier^2
export function calculateFinalSpeed(
    baseSpeed: number,
    moodModifier: number,
    weatherModifier: SurfaceAndWeatherModifiers,
    distanceModifier: DistanceAptitudeModifiers
): number {
    return (baseSpeed * moodModifier + weatherModifier.speed) * distanceModifier.speed ** 2;
}

// Calculation for actual stamina:
// Stamina * moodmodifier
export function calculateFinalStamina(
    baseStamina: number,
    moodModifier: number
): number {
    return baseStamina * moodModifier;
}