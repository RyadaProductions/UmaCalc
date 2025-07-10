import type { DistanceAptitudeModifiers, PhaseData, Stats, StrategyModifiers, TrackConditionModifiers } from "$lib/types";

// baseSpeed * strategyLateSpeedModifier + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002 + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
export function calculateTargetSpeed(
    baseSpeed: number,
    realSpeed: number,
    realWit: number,
    strategyLateSpeedModifier: number,
    distanceAptitudeSpeedModifier: number
) {
    return baseSpeed * strategyLateSpeedModifier + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002 + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 2 part equation 
// if initialSpeed <= targetSpeed
// 0.0006 * sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
// -0.8
export function calculateAcceleration(
    initialSpeed: number,
    targetSpeed: number,
    realPower: number,
    strategyLateAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
) {
    if (initialSpeed > targetSpeed) {
        return -0.8;
    }
    return 0.0006 * Math.sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// 2 part equation
// if raceDistanceInMeters / 3 <= lastSpurtDistance
// 0
// (targetSpeed - initialSpeed) / acceleration
export function calculateDuration(
    raceDistanceInMeters: number,
    lastSpurtDistance: number,
    targetSpeed: number,
    initialSpeed: number,
    acceleration: number
): number {
    if (raceDistanceInMeters / 3 <= lastSpurtDistance) {
        return 0;
    }

    return (targetSpeed - initialSpeed) / acceleration;
}

// (phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationTargetSpeed) / 2 * phaseTwoAccelerationTimeInSeconds
export function calculateDistanceInMeters(
    phaseTwoAccelerationInitialSpeed: number,
    phaseTwoAccelerationTargetSpeed: number,
    phaseTwoAccelerationTimeInSeconds: number
): number {
    return (phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationTargetSpeed) / 2 * phaseTwoAccelerationTimeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationAcceleration * phaseTwoAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (phaseTwoAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * phaseTwoAccelerationAcceleration) / 144
export function calculateHitPointsConsumption(
    baseSpeed: number,
    phaseTwoAccelerationInitialSpeed: number,
    phaseTwoAccelerationAcceleration: number,
    phaseTwoAccelerationTimeInSeconds: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number
): number {
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationAcceleration * phaseTwoAccelerationTimeInSeconds - baseSpeed + twelve) ** 3 - (phaseTwoAccelerationInitialSpeed - baseSpeed + twelve) ** 3) / (3 * phaseTwoAccelerationAcceleration) / onehundredAndFortyFour;
}

export function calculatePhaseTwoAccelerationInitialData(
    baseSpeed: number,
    realStats: Stats,
    strategyModifiers: StrategyModifiers,
    distanceAptitudeModifiers: DistanceAptitudeModifiers,
    surfaceAptitudeModifier: number,
    phaseOneSteadyData: PhaseData,
) : PhaseData {
    const initialSpeed = phaseOneSteadyData.targetSpeed;
    const targetSpeed = calculateTargetSpeed(baseSpeed, realStats.speed, realStats.wit, strategyModifiers.speedCorrection.late, distanceAptitudeModifiers.speed);
    const acceleration = calculateAcceleration(initialSpeed, targetSpeed, realStats.power, strategyModifiers.accelerationCorrection.late, distanceAptitudeModifiers.acceleration, surfaceAptitudeModifier);
   
    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: -1,
        distance: -1,
        hpConsumption: -1
    };
}

export function calculatePhaseTwoAccelerationContinuedData(
    initialData: PhaseData,
    baseSpeed: number,
    raceDistanceInMeters: number,
    lastSpurtDistance: number,
    conditionModifiers: TrackConditionModifiers,
    lastSpurtHitPointsConsumptionCoefficient: number,
): PhaseData {
    const initialSpeed = initialData.initialSpeed;
    const targetSpeed = initialData.targetSpeed;
    const acceleration = initialData.acceleration;
    const duration = calculateDuration(raceDistanceInMeters, lastSpurtDistance, targetSpeed, initialSpeed, acceleration);
    const distance = calculateDistanceInMeters(initialSpeed, targetSpeed, duration);
    const hpConsumption = calculateHitPointsConsumption(baseSpeed, initialSpeed, acceleration, duration, conditionModifiers.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient);
    
    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}