import type { PhaseData, TrackConditionModifiers } from "$lib/types";

function calculateDistanceInMeters(
    raceDistanceInMeters: number,
    idealLastSpurtAccelerationDistance: number
): number {
    return raceDistanceInMeters / 3 - idealLastSpurtAccelerationDistance;
}

function calculateDuration(
    idealLastSpurtSteadyDistance: number,
    idealLastSpurtSteadyInitialSpeed: number
): number {
    return idealLastSpurtSteadyDistance / idealLastSpurtSteadyInitialSpeed
}

function calculateHitPointsConsumption(
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    idealLastSpurtSteadyInitialSpeed: number,
    idealLastSpurtSteadyDuration: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (idealLastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 * idealLastSpurtSteadyDuration
}

export function calculateIdealLastSpurtSteadyData(
    baseSpeed: number,
    raceDistanceInMeters: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    lastSpurtAccelerationData: PhaseData,
    idealLastSpurtAccelerationData: PhaseData,
    conditionModifiers: TrackConditionModifiers,
): PhaseData {
    const initialSpeed = lastSpurtAccelerationData.targetSpeed;
    const targetSpeed = lastSpurtAccelerationData.targetSpeed;
    const acceleration = 0;
    const distance = calculateDistanceInMeters(raceDistanceInMeters, idealLastSpurtAccelerationData.distance);
    const duration = calculateDuration(distance, initialSpeed);
    const hpConsumption = calculateHitPointsConsumption(baseSpeed, conditionModifiers.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient, initialSpeed, duration);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}