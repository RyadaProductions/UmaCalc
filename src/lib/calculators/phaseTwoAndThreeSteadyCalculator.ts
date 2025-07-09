import type { PhaseData, TrackConditionModifiers } from "$lib/types";

// max(raceDistanceInMeters / 3 - lastSpurtDistance - phaseTwoAccelerationDistanceInMeters, 0)
function calculatePhaseTwoAndThreeSteadyDistanceInMeters(
    raceDistanceInMeters: number,
    lastSpurtDistance: number,
    phaseTwoAccelerationDistanceInMeters: number
): number {
    return Math.max(raceDistanceInMeters / 3 - lastSpurtDistance - phaseTwoAccelerationDistanceInMeters, 0);
}

// phaseTwoAndThreeSteadyDistanceInMeters / phaseTwoAndThreeSteadyTargetSpeed
function calculatePhaseTwoAndThreeSteadyTimeInSeconds(
    phaseTwoAndThreeSteadyDistanceInMeters: number,
    phaseTwoAndThreeSteadyTargetSpeed: number
): number {
    return phaseTwoAndThreeSteadyDistanceInMeters / phaseTwoAndThreeSteadyTargetSpeed;
}

// 20 * fieldconditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 * phaseTwoAndThreeSteadyTimeInSeconds
function calculatePhaseTwoAndThreeSteadyHitPointsConsumption(
    baseSpeed: number,
    phaseTwoAndThreeSteadyInitialSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    phaseTwoAndThreeSteadyTimeInSeconds: number
): number {
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + twelve) ** 2 / onehundredAndFortyFour * phaseTwoAndThreeSteadyTimeInSeconds;
}

export function calculatePhaseTwoAndThreeSteadyInitialData(
    phaseTwoAccelerationData: PhaseData
): PhaseData {
    const initialSpeed = phaseTwoAccelerationData.targetSpeed;
    const targetSpeed = phaseTwoAccelerationData.targetSpeed;
    const acceleration = 0;

    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: -1,
        distance: -1,
        hpConsumption: -1
    };
}

export function calculatePhaseTwoAndThreeSteadyContinuedData(
    initialData: PhaseData,
    baseSpeed: number,
    raceDistanceInMeters: number,
    lastSpurtDistance: number,
    phaseTwoAccelerationdata: PhaseData,
    conditionModifiers: TrackConditionModifiers,
    lastSpurtHitPointsConsumptionCoefficient: number,
): PhaseData {
    const initialSpeed = initialData.initialSpeed;
    const targetSpeed = initialData.targetSpeed;
    const acceleration = initialData.acceleration;
    const distance = calculatePhaseTwoAndThreeSteadyDistanceInMeters(raceDistanceInMeters, lastSpurtDistance, phaseTwoAccelerationdata.distance);
    const duration = calculatePhaseTwoAndThreeSteadyTimeInSeconds(distance, targetSpeed);
    const hpConsumption = calculatePhaseTwoAndThreeSteadyHitPointsConsumption(baseSpeed, initialSpeed, conditionModifiers.hpConsumptionCoefficient, lastSpurtHitPointsConsumptionCoefficient, duration);
    
    return {
        initialSpeed: initialSpeed,
        targetSpeed: targetSpeed,
        acceleration: acceleration,
        duration: duration,
        distance: distance,
        hpConsumption: hpConsumption
    };
    
}