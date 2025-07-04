// Calculation for base speed:

import { getWeatherModifier } from "./modifierData";

// 20 - (Distance - 2000) / 1000
export function calculateBaseSpeed(
    distance: number
): number {
    return 20 - (distance - 2000) / 1000;
}

// Calculation for target speed:
// baseSpeed * 0.85
export function calculateTargetSpeed(
    baseSpeed: number
): number {
    return baseSpeed * 0.85;
}

// Calculation for acceleration starting dash:
// 24 + 0.0006 * sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
export function calculateAcceleration(
    realPower: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    const starting = 24;
    const multiplyLow = 0.0006;
    return starting + multiplyLow * Math.sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

export const startingDashInitialSpeed = 3;
// (TargetSpeed - startinDashInitialSpeed) / StartingDashAcceleration
export function calculateStartingDashDuration(
    realPower: number,
    distance: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    const baseSpeed = calculateBaseSpeed(distance);
    return (calculateTargetSpeed(baseSpeed) - startingDashInitialSpeed) / calculateAcceleration(realPower, earlyStageAccelerationModifier, distanceAptitudeAccelerationModifier, surfaceAptitudeModifier);
}

// (startingDashInitialSpeed + TargetSpeed) / 2 * StartingDashDuration
export function calculateDistanceInMeters(
    targetSpeed: number,
    startingDashDuration: number
): number {
    return (startingDashInitialSpeed + targetSpeed) / 2 * startingDashDuration;
}

// 20 * FieldConditionHPConsumptionCoefficient * StartingDashDuration
export function calculateStartingDashHitPointsConsumption(
    startingDashDuration: number,
    selectedSurface: string,
    selectedCondition: string
): number {
    return 20 * getWeatherModifier(selectedSurface, selectedCondition).hpConsumptionCoefficient * startingDashDuration;
}