import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    strategyModifiers,
    trackAptitudeModifiers,
    type Strategy,
    type Aptitude,
    type Surface,
    type Condition,
    type Mood,
    strategyAptitudeModifiers
} from './constants.js';

import type {
    TrackConditionModifiers,
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
): TrackConditionModifiers {
    const surfaceMap = surfaceModifiers[selectedSurface];
    if (!surfaceMap) throw new Error(`Unknown surface "${selectedSurface}"`);
    const surfaceModifier = surfaceMap[selectedCondition];
    if (!surfaceModifier) throw new Error(`Unknown condition "${selectedCondition}"`);
    return surfaceModifier;
}

export function getDistanceAptitudeModifiers(
    distanceAptitudes: Aptitude,
): DistanceAptitudeModifiers {
    const modifiers = distanceAptitudeModifiers[distanceAptitudes];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${distanceAptitudes}"`);
    return modifiers;
}

export function getStageModifiers(
    selectedStrategy: Strategy,
): StrategyModifiers {
    const strategyModifier = strategyModifiers[selectedStrategy];
    if (!strategyModifier) throw new Error(`Unknown strategy "${selectedStrategy}"`);
    return strategyModifier;
}

export function getStrategyAptitudeModifiers(
    strategyAptitude: Aptitude
): number {
    const modifiers = strategyAptitudeModifiers[strategyAptitude];
    if (!modifiers) throw new Error(`No modifiers for aptitude "${strategyAptitude}"`);
    return modifiers;
}

export function getSurfaceAptitudeModifier(
    surfaceAptitude: Aptitude
): number {
    return trackAptitudeModifiers[surfaceAptitude];
}