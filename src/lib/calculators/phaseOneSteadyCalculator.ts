import type { PhaseData, TrackConditionModifiers } from "$lib/types";

// phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed
function calculateDuration(
    phaseOneSteadyDistanceInMeters: number,
    phaseOneSteadyInitialSpeed: number
): number {
    return phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed;
}

// raceDistanceInMeters / 2 - PhaseOneAccelerationDistanceInMeters
function calculateDistanceInMeters(
    raceDistanceInMeters: number,
    phaseOneAccelerationDistanceInMeters: number
): number {
    return raceDistanceInMeters / 2 - phaseOneAccelerationDistanceInMeters;
}

// 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ^ 2 / 144 * timeInSeconds)
function calculateHitPointsConsumption(
    baseSpeed: number,
    initialSpeed: number,
    timeInSeconds: number,
    fieldConditionHPConsumptionCoefficient: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ** 2 / 144 * timeInSeconds;
}

export function calculatePhaseOneSteadyData(
    baseSpeed: number,
    raceDistanceInMeters: number,
    phaseOneAccelerationData: PhaseData,
    conditionModifier: TrackConditionModifiers,
): PhaseData {
    const initialSpeed = phaseOneAccelerationData.targetSpeed;
    const targetSpeed = phaseOneAccelerationData.targetSpeed;
    const acceleration = 0;
    const distance = calculateDistanceInMeters(raceDistanceInMeters, phaseOneAccelerationData.distance);
    const duration = calculateDuration(distance, initialSpeed);
    const hpConsumption = calculateHitPointsConsumption(baseSpeed, initialSpeed, duration, conditionModifier.hpConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}