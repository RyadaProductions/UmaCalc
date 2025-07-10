import type { PhaseData } from "$lib/types";

// (-hitPointsZeroDescelerationInitialSpeed + sqrt(hitPointsZeroDescelerationInitialSpeed ^ 2 + 2 * hitPointsZeroDescelerationAcceleration * hitPointsZeroDescelerationDistanceInMeters)) / hitPointsZeroDescelerationAcceleration
function calculateDuration(
    hitPointsZeroDescelerationInitialSpeed: number,
    hitPointsZeroDescelerationAcceleration: number,
    hitPointsZeroDescelerationDistanceInMeters: number,
): number {
    return (-hitPointsZeroDescelerationInitialSpeed + Math.sqrt(hitPointsZeroDescelerationInitialSpeed ** 2 + 2 * hitPointsZeroDescelerationAcceleration * hitPointsZeroDescelerationDistanceInMeters)) / hitPointsZeroDescelerationAcceleration;
}

// raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndThreeSteadyDistanceInMeters + lastSpurtAccelerationDistanceInMeters + lastSpurtSteadyDistanceInMeters)
function calculateDistanceInMeters(
    raceDistanceInMeters: number,
    phaseTwoAccelerationDistanceInMeters: number,
    phaseTwoAndThreeSteadyDistanceInMeters: number,
    lastSpurtAccelerationDistanceInMeters: number,
    lastSpurtSteadyDistanceInMeters: number,
): number {
    return raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndThreeSteadyDistanceInMeters + lastSpurtAccelerationDistanceInMeters + lastSpurtSteadyDistanceInMeters);
}

export function calculateHitPointsZeroDecelerationData(
    raceDistanceInMeters: number,
    phaseTwoAccelerationData: PhaseData,
    phaseTwoAndThreeSteadyData: PhaseData,
    lastSpurtAccelerationData: PhaseData,
    lastSpurtSteadyData: PhaseData,
): PhaseData {
    const initialSpeed = lastSpurtSteadyData.targetSpeed;
    const targetSpeed = 0;
    const acceleration = -1.2;
    const distance = calculateDistanceInMeters(raceDistanceInMeters, phaseTwoAccelerationData.distance, phaseTwoAndThreeSteadyData.distance, lastSpurtAccelerationData.distance, lastSpurtSteadyData.distance);
    const duration = calculateDuration(initialSpeed, acceleration, distance);
    const hpConsumption = 0;

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
}