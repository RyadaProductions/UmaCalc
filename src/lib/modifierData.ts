import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    strategyModifiers,
    trackAptitudeModifiers,
    type Strategy,
    type Aptitude
} from './constants.js';

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers,
    StrategyModifiers
} from './modifierTypes.js';

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

export function getStageModifiers(
    selectedStrategy: string,
): StrategyModifiers {
    const strategyModifier = strategyModifiers[selectedStrategy.toLowerCase()];
    if (!strategyModifier) throw new Error(`Unknown strategy "${selectedStrategy}"`);
    return strategyModifier;
}

export function getSurfaceAptitudeModifier(
    selectedSurface: string,
    surfaceAptitudes: Record<string, Aptitude>
): number {
    const surfaceAptitude = surfaceAptitudes[selectedSurface.toLowerCase()];
    if (!surfaceAptitude) throw new Error(`Unknown surface "${selectedSurface}"`);
    return trackAptitudeModifiers[surfaceAptitude];
}