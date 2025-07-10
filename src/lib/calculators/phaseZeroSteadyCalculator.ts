import type { PhaseData, TrackConditionModifiers } from "$lib/types";

// phaseZeroSteadyDistanceInMeters / InitialSpeed
function calculateDuration(
    phaseZeroSteadyDistanceInMeters: number,
    initialSpeed: number
): number {
    return  phaseZeroSteadyDistanceInMeters / initialSpeed;
}

// max(trackLengthInMeters / 6 - (startingDashDistanceInMeters + phaseZeroAccelerationDistanceInMeters), 0)
function calculateDistanceInMeters(
    trackLengthInMeters: number,
    startingDashDistanceInMeters: number,
    phaseZeroAccelerationDistanceInMeters: number
): number {
    return Math.max(trackLengthInMeters / 6 - (startingDashDistanceInMeters + phaseZeroAccelerationDistanceInMeters), 0);
}

// 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ^ 2 / 144 * timeInSeconds
function calculateHitPointsConsumption(
    initialSpeed: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    timeInSeconds: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ** 2 / 144 * timeInSeconds;
}

export function calculatePhaseZeroSteadyData(
    baseSpeed: number,
    raceDistanceInMeters: number,
    phaseZeroAccelerationData: PhaseData,
    startingDashData: PhaseData,
    conditionModifiers: TrackConditionModifiers
): PhaseData {
    const initialSpeed = phaseZeroAccelerationData.targetSpeed;
    const targetSpeed = phaseZeroAccelerationData.targetSpeed;
    const acceleration = 0;
    const distance = calculateDistanceInMeters(raceDistanceInMeters, startingDashData.distance, phaseZeroAccelerationData.distance);
    const duration = calculateDuration(distance, initialSpeed);
    const hpConsumption = calculateHitPointsConsumption(initialSpeed, baseSpeed, conditionModifiers.hpConsumptionCoefficient, duration);

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}