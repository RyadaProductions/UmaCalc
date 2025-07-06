export const startingDashInitialSpeed = 3;

// Calculation for target speed:
// baseSpeed * 0.85
export function calculateStartingDashTargetSpeed(
    baseSpeed: number
): number {
    return baseSpeed * 0.85;
}

// Calculation for acceleration starting dash:
// 24 + 0.0006 * sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
export function calculateStartingDashAcceleration(
    realPower: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    const starting = 24;
    const multiplyLow = 0.0006;
    return starting + multiplyLow * Math.sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// (TargetSpeed - startinDashInitialSpeed) / StartingDashAcceleration
export function calculateStartingDashDuration(
    realPower: number,
    baseSpeed: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    return (calculateStartingDashTargetSpeed(baseSpeed) - startingDashInitialSpeed) / calculateStartingDashAcceleration(realPower, earlyStageAccelerationModifier, distanceAptitudeAccelerationModifier, surfaceAptitudeModifier);
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
    fieldConditionHPConsumptionCoefficient: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * startingDashDuration;
}