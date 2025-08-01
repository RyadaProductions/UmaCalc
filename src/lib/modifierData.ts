import {
    moodModifiers,
    surfaceModifiers,
    distanceAptitudeModifiers,
    strategyModifiers,
    trackAptitudeModifiers as surfaceAptitudeModifiers,
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
} from './types.js';

export function getMoodModifier(
    selectedMood: Mood
): number {
    return moodModifiers[selectedMood];
}

export function getConditionModifiers(
    selectedSurface: Surface,
    selectedCondition: Condition,
): TrackConditionModifiers {
    const surfaceMap = surfaceModifiers[selectedSurface];
    return surfaceMap[selectedCondition];
}

export function getDistanceAptitudeModifiers(
    distanceAptitudes: Aptitude,
): DistanceAptitudeModifiers {
    return distanceAptitudeModifiers[distanceAptitudes];
}

export function getStrategyModifiers(
    selectedStrategy: Strategy,
): StrategyModifiers {
    return strategyModifiers[selectedStrategy];
}

export function getStrategyAptitudeModifier(
    strategyAptitude: Aptitude
): number {
    return strategyAptitudeModifiers[strategyAptitude];
}

export function getSurfaceAptitudeModifier(
    surfaceAptitude: Aptitude
): number {
    return surfaceAptitudeModifiers[surfaceAptitude];
}