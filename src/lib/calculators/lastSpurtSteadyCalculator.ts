import type { PhaseData, TrackConditionModifiers } from "$lib/types";

// lastSpurtSteadyHitPointsConsumption / (20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144)
function calculateDuration(
    baseSpeed: number,
    lastSpurtSteadyInitialSpeed: number,
    lastSpurtSteadyHitPointsConsumption: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
): number {
    return lastSpurtSteadyHitPointsConsumption / (20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144);
}

// We've split this out in the main calculator
// min(
//  20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 * (raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndTheeSteadyDistanceInMeters + LastSpurtAccelerationDistanceInMeters)) / lastSpurtSteadyInitialSpeed,
//  remainingHitPointsBeforeLastSpurt
// )
function calculateHitPointsConsumption(
    baseSpeed: number,
    raceDistanceInMeters: number,
    lastSpurtSteadyInitialSpeed: number,
    phaseTwoAccelerationDistanceInMeters: number,
    phaseTwoAndTheeSteadyDistanceInMeters: number,
    LastSpurtAccelerationDistanceInMeters: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 * (raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndTheeSteadyDistanceInMeters + LastSpurtAccelerationDistanceInMeters)) / lastSpurtSteadyInitialSpeed;
}

// lastSpurtSteadyInitialSpeed * lastSpurtSteadyTimeInSeconds
function calculateDistanceInMeters(
    lastSpurtSteadyInitialSpeed: number,
    lastSpurtSteadyTimeInSeconds: number
): number {
    return lastSpurtSteadyInitialSpeed * lastSpurtSteadyTimeInSeconds;
}

export function calculateLastSpurtSteadyData(
    baseSpeed: number,
    raceDistanceInMeters: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    remainingHitPointsBeforeLastSpurt: number,
    phaseTwoAccelerationData: PhaseData,
    phaseTwoAndThreeSteadyData: PhaseData,
    lastSpurtAccelerationData: PhaseData,
    conditionModifier: TrackConditionModifiers,
): PhaseData {
    const initialSpeed = lastSpurtAccelerationData.targetSpeed;
    const targetSpeed = lastSpurtAccelerationData.targetSpeed;
    const acceleration = 0;
    const targetHpConsumption = calculateHitPointsConsumption(baseSpeed, raceDistanceInMeters, initialSpeed, phaseTwoAccelerationData.distance, phaseTwoAndThreeSteadyData.distance, lastSpurtAccelerationData.distance, conditionModifier.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient);
    const hpConsumption = Math.min(targetHpConsumption, remainingHitPointsBeforeLastSpurt);
    const duration = calculateDuration(baseSpeed, initialSpeed, hpConsumption, conditionModifier.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient);
    const distance = calculateDistanceInMeters(initialSpeed, duration);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}