import type { 
    PhaseData, 
    TrackConditionModifiers 
} from "$lib/types";

const startingDashInitialSpeed = 3;

// Calculation for target speed:
// baseSpeed * 0.85
function calculateStartingDashTargetSpeed(
    baseSpeed: number
): number {
    return baseSpeed * 0.85;
}

// Calculation for acceleration starting dash:
// 24 + 0.0006 * sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
function calculateStartingDashAcceleration(
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
function calculateStartingDashDuration(
    startingDashTargetSpeed: number,
    startingDashAcceleration: number
): number {
    return (startingDashTargetSpeed - startingDashInitialSpeed) / startingDashAcceleration;
}

// (startingDashInitialSpeed + TargetSpeed) / 2 * StartingDashDuration
function calculateDistanceInMeters(
    targetSpeed: number,
    startingDashDuration: number
): number {
    return (startingDashInitialSpeed + targetSpeed) / 2 * startingDashDuration;
}

// 20 * FieldConditionHPConsumptionCoefficient * StartingDashDuration
function calculateStartingDashHitPointsConsumption(
    startingDashDuration: number,
    fieldConditionHPConsumptionCoefficient: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * startingDashDuration;
}

export function calculateStartingDashData(
    baseSpeed: number,
    realPower: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number,
    conditionModifiers: TrackConditionModifiers
): PhaseData {
    const initialSpeed = startingDashInitialSpeed;
    const targetSpeed = calculateStartingDashTargetSpeed(baseSpeed);
    const acceleration = calculateStartingDashAcceleration(realPower, earlyStageAccelerationModifier, distanceAptitudeAccelerationModifier, surfaceAptitudeModifier);
    const duration = calculateStartingDashDuration(targetSpeed, acceleration);
    const distance = calculateDistanceInMeters(targetSpeed, duration);
    const hpConsumption = calculateStartingDashHitPointsConsumption(duration, conditionModifiers.hpConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        distance: distance,
        timeInSeconds: duration,
        hpConsumption: hpConsumption
    }
}