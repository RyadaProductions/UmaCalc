// phaseZeroAccelerationInitialSpeed + phaseZeroAccelerationAcceleration * phaseZeroAccelerationTimeInSeconds
export function calculatePhaseOneAccelerationInitialSpeed(
    phaseZeroInitialSpeed: number,
    phaseZeroAcceleration: number,
    phaseZeroTimeInSeconds: number
): number {
    return phaseZeroInitialSpeed + phaseZeroAcceleration * phaseZeroTimeInSeconds;
}

// baseSpeed * strategyMiddleSpeedModifier + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
export function calculatePhaseOneAccelerationTargetSpeed(
    baseSpeed: number,
    realWit: number,
    strategyMiddleSpeedModifier: number
): number {
    return baseSpeed * strategyMiddleSpeedModifier + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 2 part equation 
// if initialSpeed <= targetSpeed
// 0.006 * sqrt(500 * realPower) * strategyMiddleAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
// -0.8
export function calculatePhaseOneAccelerationAcceleration(
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

    return 0.006 * Math.sqrt(500 * realPower) * strategyMiddleAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// targetSpeed - initialSpeed / acceleration
export function calculatePhaseOneAccelerationTimeInSeconds(
    initialSpeed: number,
    targetSpeed: number,
    acceleration: number
): number {
    return (targetSpeed - initialSpeed) / acceleration;
}

// (initialSpeed + targetSpeed) / 2 * timeInSeconds
export function calculatePhaseOneAccelerationDistanceInMeters(
    initialSpeed: number,
    targetSpeed: number,
    timeInSeconds: number
): number {
    return (initialSpeed + targetSpeed) / 2 * timeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * ((targetSpeed - baseSpeed + 12) ^ 3 - (initialSpeed - baseSpeed + 12) ^ 3) / (3 * acceleration) / 144
export function calculatePhaseOneAccelerationHitPointsConsumption(
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

// phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed
export function calculatePhaseOneSteadyTimeInSeconds(
    phaseOneSteadyDistanceInMeters: number,
    phaseOneSteadyInitialSpeed: number
): number {
    return phaseOneSteadyDistanceInMeters / phaseOneSteadyInitialSpeed;
}

// raceDistanceInMeters / 2 - PhaseOneAccelerationDistanceInMeters
export function calculatePhaseOneSteadyDistanceInMeters(
    raceDistanceInMeters: number,
    phaseOneAccelerationDistanceInMeters: number
): number {
    return raceDistanceInMeters / 2 - phaseOneAccelerationDistanceInMeters;
}

// 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ^ 2 / 144 * timeInSeconds)
export function calculatePhaseOneSteadyHitPointsConsumption(
    initialSpeed: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    timeInSeconds: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ** 2 / 144 * timeInSeconds;
}