import type { DistanceAptitudeModifiers, PhaseData, Stats, StrategyModifiers, TrackConditionModifiers } from "$lib/types";

// phaseZeroAccelerationInitialSpeed + phaseZeroAccelerationAcceleration * phaseZeroAccelerationTimeInSeconds
function calculateInitialSpeed(
    phaseZeroInitialSpeed: number,
    phaseZeroAcceleration: number,
    phaseZeroTimeInSeconds: number
): number {
    return phaseZeroInitialSpeed + phaseZeroAcceleration * phaseZeroTimeInSeconds;
}

// baseSpeed * strategyMiddleSpeedModifier + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
function calculateTargetSpeed(
    baseSpeed: number,
    realWit: number,
    strategyMiddleSpeedModifier: number
): number {
    return baseSpeed * strategyMiddleSpeedModifier + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 2 part equation 
// if initialSpeed <= targetSpeed
// 0.0006 * sqrt(500 * realPower) * strategyMiddleAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
// -0.8
function calculateAcceleration(
    initialSpeed: number,
    targetSpeed: number,
    realPower: number,
    strategyMiddleAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    // inverted logic to prevent nesting
    if (initialSpeed > targetSpeed) {
        return -0.8;
    }

    return 0.0006 * Math.sqrt(500 * realPower) * strategyMiddleAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// targetSpeed - initialSpeed / acceleration
function calculateDuration(
    initialSpeed: number,
    targetSpeed: number,
    acceleration: number
): number {
    return (targetSpeed - initialSpeed) / acceleration;
}

// (initialSpeed + targetSpeed) / 2 * timeInSeconds
function calculateDistanceInMeters(
    initialSpeed: number,
    targetSpeed: number,
    timeInSeconds: number
): number {
    return (initialSpeed + targetSpeed) / 2 * timeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * ((targetSpeed - baseSpeed + 12) ^ 3 - (initialSpeed - baseSpeed + 12) ^ 3) / (3 * acceleration) / 144
function calculateHitPointsConsumption(
    initialSpeed: number,
    targetSpeed: number,
    acceleration: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number
) {
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * ((targetSpeed - baseSpeed + twelve) ** 3 - (initialSpeed - baseSpeed + twelve) ** 3) / (3 * acceleration) / onehundredAndFortyFour;
}

export function calculatePhaseOneAccelerationData(
    baseSpeed: number,
    realStats: Stats,
    phaseZeroAccelerationData: PhaseData,
    strategyModifiers: StrategyModifiers,
    distanceAptitudeModifiers: DistanceAptitudeModifiers,
    surfaceAptitudeModifier: number,
    conditionModifiers: TrackConditionModifiers
): PhaseData {
    const initialSpeed = calculateInitialSpeed(phaseZeroAccelerationData.initialSpeed, phaseZeroAccelerationData.acceleration, phaseZeroAccelerationData.duration);
    const targetSpeed = calculateTargetSpeed(baseSpeed, realStats.wit, strategyModifiers.speedCorrection.middle);
    const acceleration = calculateAcceleration(initialSpeed, targetSpeed, realStats.power, strategyModifiers.accelerationCorrection.middle, distanceAptitudeModifiers.acceleration, surfaceAptitudeModifier);
    const duration = calculateDuration(initialSpeed, targetSpeed, acceleration);
    const distance = calculateDistanceInMeters(initialSpeed, targetSpeed, duration);
    const hpConsumption = calculateHitPointsConsumption(initialSpeed, targetSpeed, acceleration, baseSpeed, conditionModifiers.hpConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}