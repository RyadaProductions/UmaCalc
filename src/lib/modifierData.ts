import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    strategyModifiers,
    trackAptitudeModifiers,
    type Strategy,
    type Aptitude,
    type Distance,
    type Surface,
    type Condition,
    type Mood
} from './constants.js';

import type {
    SurfaceAndWeatherModifiers,
    DistanceAptitudeModifiers,
    StrategyModifiers
} from './modifierTypes.js';

export function getMoodModifier(
    selectedMood: Mood
): number {
    const key = selectedMood.toLowerCase();
    const moodModifier = moodModifiers[key];
    if (moodModifier == null) throw new Error(`Unknown mood "${selectedMood}"`);
    return moodModifier;
}

export function getWeatherModifier(
    selectedSurface: Surface,
    selectedCondition: Condition,
): SurfaceAndWeatherModifiers {
    const surfaceMap = surfaceModifiers[selectedSurface];
    if (!surfaceMap) throw new Error(`Unknown surface "${selectedSurface}"`);
    const surfaceModifier = surfaceMap[selectedCondition];
    if (!surfaceModifier) throw new Error(`Unknown condition "${selectedCondition}"`);
    return surfaceModifier;
}

export function getDistanceAptitudeModifiers(
    distance: Distance,
    distanceAptitudes: Record<Distance, Aptitude>,
): DistanceAptitudeModifiers {
    const aptitude = distanceAptitudes[distance];
    if (!aptitude) throw new Error(`No aptitude for distance "${distance}"`);
    const modifiers = distanceAptitudeModifiers[aptitude];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${aptitude}"`);
    return modifiers;
}

export function getStrategyAptitudeModifiers(
    strategy: Strategy,
    strategyAptitudes: Record<Strategy, Aptitude>
): DistanceAptitudeModifiers {
    const aptitude = strategyAptitudes[strategy];
    if (!aptitude) throw new Error(`No aptitude for strategy "${strategy}"`);
    const modifiers = distanceAptitudeModifiers[aptitude];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${aptitude}"`);
    return modifiers;
}

export function getStageModifiers(
    selectedStrategy: Strategy,
): StrategyModifiers {
    const strategyModifier = strategyModifiers[selectedStrategy];
    if (!strategyModifier) throw new Error(`Unknown strategy "${selectedStrategy}"`);
    return strategyModifier;
}

export function getSurfaceAptitudeModifier(
    selectedSurface: Surface,
    surfaceAptitudes: Record<Surface, Aptitude>
): number {
    const surfaceAptitude = surfaceAptitudes[selectedSurface];
    if (!surfaceAptitude) throw new Error(`Unknown surface "${selectedSurface}"`);
    return trackAptitudeModifiers[surfaceAptitude];
}