import type { PhaseData, Stats, TrackConditionModifiers } from "$lib/types";

// baseSpeed * 0.85
function calculateInitialSpeed(
    baseSpeed: number
): number {
    return baseSpeed * 0.85;
}

// baseSpeed * strategyEarlySpeedCorrection + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
function calculateTargetSpeed(
    baseSpeed: number,
    realWit: number,
    strategyEarlySpeedCorrection: number
): number {
    return baseSpeed * strategyEarlySpeedCorrection + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 24 + 0.0006 * sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
function calculateAcceleration(
    realPower: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    const multiplyLow = 0.0006;
    return multiplyLow * Math.sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// min((targetSpeed - initialSpeed) / acceleration, (-initialSpeed + sqrt(initialspeed ^ 2 + 2 * acceleration * (raceDistanceInMeters / 6 - startingDashDistance))) / acceleration)
function calculateDuration(
    initialSpeed: number,
    targetSpeed: number,
    acceleration: number,
    raceDistanceInMeters: number,
    startingDashDistance: number
): number {
    const leftSide = (targetSpeed - initialSpeed) / acceleration;
    const rightSide = (-initialSpeed + Math.sqrt(initialSpeed ** 2 + 2 * acceleration * (raceDistanceInMeters / 6 - startingDashDistance))) / acceleration;
    return Math.min(leftSide, rightSide);
}

// (initialSpeed + acceleration * timeInSeconds / 2) * timeInSeconds
function calculateDistanceInMeters(
    initialSpeed: number,
    acceleration: number,
    timeInSeconds: number
): number {
    return (initialSpeed + acceleration * timeInSeconds / 2) * timeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * ((acceleration * timeInSeconds + initialSpeed - baseSpeed + 12) ^ 3 - (initialSpeed - baseSpeed + 12) ^ 3) / (3 * acceleration) / 144
function calculateHitPointsConsumption(
    initialSpeed: number,
    acceleration: number,
    timeInSeconds: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number
): number {
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * ((acceleration * timeInSeconds + initialSpeed - baseSpeed + twelve) ** 3 - (initialSpeed - baseSpeed + twelve) ** 3) / (3 * acceleration) / onehundredAndFortyFour;
}

export function calculatePhaseZeroAccelerationData(
    baseSpeed: number,
    realStats: Stats,
    strategyEarlySpeedCorrection: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number,
    raceDistanceInMeters: number,
    startingDashDistance: number,
    conditionModifiers: TrackConditionModifiers
): PhaseData {
    const initialSpeed = calculateInitialSpeed(baseSpeed);
    const targetSpeed = calculateTargetSpeed(baseSpeed, realStats.wit, strategyEarlySpeedCorrection);
    const acceleration = calculateAcceleration(realStats.power, earlyStageAccelerationModifier, distanceAptitudeAccelerationModifier, surfaceAptitudeModifier);
    const duration = calculateDuration(initialSpeed, targetSpeed, acceleration, raceDistanceInMeters, startingDashDistance);
    const distance = calculateDistanceInMeters(initialSpeed, acceleration, duration);
    const hpConsumption = calculateHitPointsConsumption(initialSpeed, acceleration, duration, baseSpeed, conditionModifiers.hpConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}