// baseSpeed * strategyLateAccelerationModifier + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002 + ((realWit / 5500) * log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed
export function calculatePhaseTwoAccelerationTargetSpeed(
    baseSpeed: number,
    realSpeed: number,
    realWit: number,
    strategyLateAccelerationModifier: number,
    distanceAptitudeSpeedModifier: number
) {
    return baseSpeed * strategyLateAccelerationModifier + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002 + ((realWit / 5500) * Math.log10(realWit * 0.1) - 0.65 / 2) * 0.01 * baseSpeed;
}

// 2 part equation 
// if initialSpeed <= targetSpeed
// 0.006 * sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier
// -0.8
export function calculatePhaseTwoAccelerationAcceleration(
    initialSpeed: number,
    targetSpeed: number,
    realPower: number,
    strategyLateAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
) {
    if (initialSpeed > targetSpeed) {
        return -0.8;
    }
    console.log(`initialSpeed: ${initialSpeed}, targetSpeed: ${targetSpeed}, realPower: ${realPower}, strategyLateAccelerationModifier: ${strategyLateAccelerationModifier}, distanceAptitudeAccelerationModifier: ${distanceAptitudeAccelerationModifier}, surfaceAptitudeModifier: ${surfaceAptitudeModifier}`);
    console.log(`realPower: ${realPower}, strategyLateAccelerationModifier: ${strategyLateAccelerationModifier}, distanceAptitudeAccelerationModifier: ${distanceAptitudeAccelerationModifier}, surfaceAptitudeModifier: ${surfaceAptitudeModifier}`);
    return 0.0006 * Math.sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// 2 part equation
// if raceDistanceInMeters / 3 <= lastSpurtDistance
// 0
// (targetSpeed - initialSpeed) / acceleration
export function calculatePhaseTwoAccelerationTimeInSeconds(
    raceDistanceInMeters: number,
    lastSpurtDistance: number,
    targetSpeed: number,
    initialSpeed: number,
    acceleration: number
): number {
    if (raceDistanceInMeters / 3 <= lastSpurtDistance) {
        return 0;
    }

    return (targetSpeed - initialSpeed) / acceleration;
}

// (phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationTargetSpeed) / 2 * phaseTwoAccelerationTimeInSeconds
export function calculatePhaseTwoAccelerationDistanceInMeters(
    phaseTwoAccelerationInitialSpeed: number,
    phaseTwoAccelerationTargetSpeed: number,
    phaseTwoAccelerationTimeInSeconds: number
): number {
    return (phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationTargetSpeed) / 2 * phaseTwoAccelerationTimeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationAcceleration * phaseTwoAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (phaseTwoAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * phaseTwoAccelerationAcceleration) / 144
export function calculatePhaseTwoAccelerationHitPointsConsumption(
    phaseTwoAccelerationInitialSpeed: number,
    phaseTwoAccelerationAcceleration: number,
    phaseTwoAccelerationTimeInSeconds: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number
): number {
    const twenty = 20;
    const twelve = 12;
    const onehundredAndFortyFour = 144;
    return twenty * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((phaseTwoAccelerationInitialSpeed + phaseTwoAccelerationAcceleration * phaseTwoAccelerationTimeInSeconds - baseSpeed + twelve) ** 3 - (phaseTwoAccelerationInitialSpeed - baseSpeed + twelve) ** 3) / (3 * phaseTwoAccelerationAcceleration) / onehundredAndFortyFour;
}