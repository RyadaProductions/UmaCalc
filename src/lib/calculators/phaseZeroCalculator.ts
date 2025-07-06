// -- Phase Zero Acceleration

// baseSpeed * 0.85
export function calculatePhaseZeroAccelerationInitialSpeed(
    baseSpeed: number
): number {
    return baseSpeed * 0.85;
}

// baseSpeed * strategyEarlySpeedCorrection + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
export function calculatePhaseZeroAccelerationTargetSpeed(
    baseSpeed: number,
    realWit: number,
    strategyEarlySpeedCorrection: number
): number {
    return baseSpeed * strategyEarlySpeedCorrection + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 24 + 0.0006 * sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
export function calculatePhaseZeroAccelerationAcceleration(
    realPower: number,
    earlyStageAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
): number {
    const multiplyLow = 0.0006;
    return multiplyLow * Math.sqrt(500 * realPower) * earlyStageAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// min((targetSpeed - initialSpeed) / acceleration, (-initialSpeed + sqrt(initialspeed ^ 2 + 2 * acceleration * (raceDistanceInMeters / 6 - startingDashDistance))) / acceleration)
export function calculatePhaseZeroAccelerationTimeInSeconds(
    initialSpeed: number,
    targetSpeed: number,
    acceleration: number,
    raceDistanceInMeters: number,
    startingDashDistance: number
): number {
    const leftSide = (targetSpeed - initialSpeed) / acceleration;
    const rightSide = (-initialSpeed + Math.sqrt(initialSpeed ** 2 + 2 * acceleration * (raceDistanceInMeters / 6 - startingDashDistance))) / acceleration;
    return Math.min(leftSide, rightSide);
}

// (initialSpeed + acceleration * timeInSeconds / 2) * timeInSeconds
export function calculatePhaseZeroAccelerationDistanceInMeters(
    initialSpeed: number,
    acceleration: number,
    timeInSeconds: number
): number {
    return (initialSpeed + acceleration * timeInSeconds / 2) * timeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * ((acceleration * timeInSeconds + initialSpeed - baseSpeed + 12) ^ 3 - (initialSpeed - baseSpeed + 12) ^ 3) / (3 * acceleration) / 144
export function calculatePhaseZeroAccelerationHitPointsConsumption(
    initialSpeed: number,
    acceleration: number,
    timeInSeconds: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number
): number {
    console.log(`initialSpeed: ${initialSpeed}, acceleration: ${acceleration}, timeInSeconds: ${timeInSeconds}, baseSpeed: ${baseSpeed}, fieldConditionHPConsumptionCoefficient: ${fieldConditionHPConsumptionCoefficient}`);
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * ((acceleration * timeInSeconds + initialSpeed - baseSpeed + twelve) ** 3 - (initialSpeed - baseSpeed + twelve) ** 3) / (3 * acceleration) / onehundredAndFortyFour;
}

// phaseZeroSteadyDistanceInMeters / InitialSpeed
export function calculatePhaseZeroSteadyTime(
    phaseZeroSteadyDistanceInMeters: number,
    initialSpeed: number
): number {
    return  phaseZeroSteadyDistanceInMeters / initialSpeed;
}

// max(trackLengthInMeters / 6 - (startingDashDistanceInMeters + phaseZeroAccelerationDistanceInMeters), 0)
export function calculatePhaseZeroSteadyDistanceInMeters(
    trackLengthInMeters: number,
    startingDashDistanceInMeters: number,
    phaseZeroAccelerationDistanceInMeters: number
): number {
    return Math.max(trackLengthInMeters / 6 - (startingDashDistanceInMeters + phaseZeroAccelerationDistanceInMeters), 0);
}

// 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ^ 2 / 144 * timeInSeconds
export function calculatePhaseZeroSteadyHitPointsConsumption(
    initialSpeed: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    timeInSeconds: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * (initialSpeed - baseSpeed + 12) ** 2 / 144 * timeInSeconds;
}