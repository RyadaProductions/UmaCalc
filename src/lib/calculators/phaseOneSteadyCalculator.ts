import type { PhaseData, TrackConditionModifiers } from "$lib/types";

// phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed
function calculatePhaseOneSteadyTimeInSeconds(
    phaseOneSteadyDistanceInMeters: number,
    phaseOneSteadyInitialSpeed: number
): number {
    return phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed;
}

// raceDistanceInMeters / 2 - PhaseOneAccelerationDistanceInMeters
function calculatePhaseOneSteadyDistanceInMeters(
    raceDistanceInMeters: number,
    phaseOneAccelerationDistanceInMeters: number
): number {
    return raceDistanceInMeters / 2 - phaseOneAccelerationDistanceInMeters;
}

// 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ^ 2 / 144 * timeInSeconds)
function calculatePhaseOneSteadyHitPointsConsumption(
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
    const distance = calculatePhaseOneSteadyDistanceInMeters(raceDistanceInMeters, phaseOneAccelerationData.distance);
    const duration = calculatePhaseOneSteadyTimeInSeconds(distance, initialSpeed);
    const hpConsumption = calculatePhaseOneSteadyHitPointsConsumption(baseSpeed, initialSpeed, duration, conditionModifier.hpConsumptionCoefficient);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}