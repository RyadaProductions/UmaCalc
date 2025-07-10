import type { DistanceAptitudeModifiers, PhaseData, Stats, StrategyModifiers, TrackConditionModifiers } from "$lib/types";

// if phaseTwoAccelerationDistanceInMeters = 0
// phaseOneSteadyTargetSpeed
// phaseTwoAndThreeSteadyTargetSpeed
function calculateInitialSpeed(
    phaseOneSteadyTargetSpeed: number,
    phaseTwoAccelerationDistanceInMeters: number,
    phaseTwoAndThreeSteadyTargetSpeed: number
): number {
    if (phaseTwoAccelerationDistanceInMeters === 0) {
        return phaseOneSteadyTargetSpeed;
    }
    return phaseTwoAndThreeSteadyTargetSpeed;
}

// (baseSpeed * (strategyLateSpeedModifier + 0.01) + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002) * 1.05 + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002
function calculateTargetSpeed(
    baseSpeed: number,
    realSpeed: number,
    strategyLateSpeedModifier: number,
    distanceAptitudeSpeedModifier: number
): number {
    return (baseSpeed * (strategyLateSpeedModifier + 0.01) + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002) * 1.05 + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002;
}

// 0.0006 * sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surtfaceAptitudeModifier
function calculateAcceleration(
    realPower: number,
    strategyLateAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
) {
    return 0.0006 * Math.sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// (lastSpurtAccelerationTargetSpeed - lastSpurtAccelerationInitialSpeed) / lastSpurtAccelerationAcceleration
function calculateDuration(
    lastSpurtAccelerationTargetSpeed: number,
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationAcceleration: number
): number {
    return (lastSpurtAccelerationTargetSpeed - lastSpurtAccelerationInitialSpeed) / lastSpurtAccelerationAcceleration;
}

// (lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationTargetSpeed) / 2 * lastSpurtAccelerationTimeInSeconds
function calculateDistanceInMeters(
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationTargetSpeed: number,
    lastSpurtAccelerationTimeInSeconds: number
): number {
    return (lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationTargetSpeed) / 2 * lastSpurtAccelerationTimeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationAcceleration * lastSpurtAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (lastSpurtAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * lastSpurtAccelerationAcceleration) / 144
function calculateHitPointsConsumption(
    baseSpeed: number,
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationAcceleration: number,
    lastSpurtAccelerationTimeInSeconds: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationAcceleration * lastSpurtAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (lastSpurtAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * lastSpurtAccelerationAcceleration) / 144;
}

export function calculateLastSpurtAccelerationInitialData(
    baseSpeed: number,
    realStats: Stats,
    strategyModifiers: StrategyModifiers,
    distanceAptitudeModifiers: DistanceAptitudeModifiers
): PhaseData {
    const initialSpeed = -1;
    const targetSpeed = calculateTargetSpeed(baseSpeed, realStats.speed, strategyModifiers.speedCorrection.late, distanceAptitudeModifiers.speed);
    const acceleration = -1;
    const duration = -1;
    const distance = -1;
    const hpConsumption = -1;

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}

export function calculateLastSpurtAccelerationContinuedData(
    initialData: PhaseData,
    baseSpeed: number,
    realStats: Stats,
    strategyModifiers: StrategyModifiers,
    distanceAptitudeModifiers: DistanceAptitudeModifiers,
    surfaceModifier: number,
    conditionModifiers: TrackConditionModifiers,
    lastSpurtHitPointsConsumptionCoefficient: number,
    PhaseOneSteadyData: PhaseData,
    phaseTwoAccelerationData: PhaseData,
    PhaseTwoAndThreeSteadyData: PhaseData,
): PhaseData {
    const initialSpeed = calculateInitialSpeed(PhaseOneSteadyData.targetSpeed, phaseTwoAccelerationData.distance, PhaseTwoAndThreeSteadyData.targetSpeed);
    const targetSpeed = initialData.targetSpeed;
    const acceleration = calculateAcceleration(realStats.power, strategyModifiers.accelerationCorrection.late, distanceAptitudeModifiers.acceleration, surfaceModifier);
    const duration = calculateDuration(targetSpeed, initialSpeed, acceleration);
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

export function calculateIdealLastSpurtAccelerationData(
    baseSpeed: number,
    conditionModifiers: TrackConditionModifiers,
    lastSpurtHitPointsConsumptionCoefficient: number,
    PhaseOneSteadyData: PhaseData,
    PhaseTwoAccelerationData: PhaseData,
    lastSpurtAccelerationData: PhaseData,
): PhaseData {
    const initialSpeed = PhaseOneSteadyData.targetSpeed;
    const targetSpeed = lastSpurtAccelerationData.targetSpeed;
    const acceleration = lastSpurtAccelerationData.acceleration;
    const duration = calculateDuration(targetSpeed, initialSpeed, acceleration);
    const distance = calculateDistanceInMeters(initialSpeed, targetSpeed, duration);
    const hpConsumption = calculateHitPointsConsumption(baseSpeed, PhaseTwoAccelerationData.initialSpeed, lastSpurtAccelerationData.acceleration, duration, conditionModifiers.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}