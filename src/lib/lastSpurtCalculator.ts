
// totalConsumedHitPointsTillPhaseTwo = startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption
// min((hpWithRecovery - totalConsumedHitPointsTillPhaseTwo) - (raceDistanceInMeters / 3 - 60) * 20 * fieldConditionHPCoeffienct * lastSpurtConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - lastSpurtSteadyInitialSpeed + 12) ^ 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed) / (20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * ((LastSpurtSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 / lastSpurtSteadyInitialSpeed - (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed)) + 60, raceDistanceInMeters / 3)
export function calculateLastSpurtDistance(
    raceDistanceInMeters: number,
    hitPointsWithRecovery: number,
    startingDashHitPointsConsumption: number,
    phaseZeroAccelerationHitPointsConsumption: number,
    phaseZeroSteadyHitPointsConsumption: number,
    phaseOneAccelerationHitPointsConsumption: number,
    phaseOneSteadyHitPointsConsumption: number,
    fieldConditionHPCoefficient: number,
    lastSpurtConsumptionCoefficient: number,
    phaseTwoAndThreeSteadyInitialSpeed: number,
    lastSpurtSteadyInitialSpeed: number,
    baseSpeed: number,
): number {
    const totalConsumedHitPointsTillPhaseTwo = startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption;
    const lastSpurtBasedOnStamina = (hitPointsWithRecovery - totalConsumedHitPointsTillPhaseTwo - (raceDistanceInMeters / 3 - 60) * 20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - lastSpurtSteadyInitialSpeed + 12) ** 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed) / (20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * ((lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 / lastSpurtSteadyInitialSpeed - (phaseTwoAndThreeSteadyInitialSpeed - lastSpurtSteadyInitialSpeed + 12) ** 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed)) + 60;
    const minimumDistance = raceDistanceInMeters / 3;
    return Math.min(lastSpurtBasedOnStamina, minimumDistance);
}

// 1 + (200 / sqrt(600 * realGuts))
export function calculateLastSpurtHitPointsConsumptionCoefficient(
    realGuts: number
): number {
    return 1 + (200 / Math.sqrt(600 * realGuts));
}

// if phaseTwoAccelerationDistanceInMeters = 0
// phaseOneSteadyTargetSpeed
// phaseTwoAndThreeSteadyTargetSpeed
export function calculateLastSpurtAccelerationInitialSpeed(
    phaseTwoAccelerationDistanceInMeters: number,
    phaseOneSteadyTargetSpeed: number,
    phaseTwoAndThreeSteadyTargetSpeed: number
): number {
    if (phaseTwoAccelerationDistanceInMeters === 0) {
        return phaseOneSteadyTargetSpeed;
    }
    return phaseTwoAndThreeSteadyTargetSpeed;
}

// (baseSpeed * (strategyLateSpeedModifier + 0.01) + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002) * 1.05 + sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002
export function calculateLastSpurtAccelerationTargetSpeed(
    baseSpeed: number,
    realSpeed: number,
    strategyLateSpeedModifier: number,
    distanceAptitudeSpeedModifier: number
): number {
    return (baseSpeed * (strategyLateSpeedModifier + 0.01) + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002) * 1.05 + Math.sqrt(500 * realSpeed) * distanceAptitudeSpeedModifier * 0.002;
}

// 0.0006 * sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surtfaceAptitudeModifier
export function calculateLastSpurtAccelerationAcceleration(
    realPower: number,
    strategyLateAccelerationModifier: number,
    distanceAptitudeAccelerationModifier: number,
    surfaceAptitudeModifier: number
) {
    return 0.0006 * Math.sqrt(500 * realPower) * strategyLateAccelerationModifier * distanceAptitudeAccelerationModifier * surfaceAptitudeModifier;
}

// (lastSpurtAccelerationTargetSpeed - lastSpurtAccelerationInitialSpeed) / lastSpurtAccelerationAcceleration
export function calculateLastSpurtAccelerationTimeInSeconds(
    lastSpurtAccelerationTargetSpeed: number,
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationAcceleration: number
): number {
    return (lastSpurtAccelerationTargetSpeed - lastSpurtAccelerationInitialSpeed) / lastSpurtAccelerationAcceleration;
}

// (lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationTargetSpeed) / 2 * lastSpurtAccelerationTimeInSeconds
export function calculateLastSpurtAccelerationDistanceInMeters(
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationTargetSpeed: number,
    lastSpurtAccelerationTimeInSeconds: number
): number {
    return (lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationTargetSpeed) / 2 * lastSpurtAccelerationTimeInSeconds;
}

// 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationAcceleration * lastSpurtAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (lastSpurtAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * lastSpurtAccelerationAcceleration) / 144
export function calculateLastSpurtAccelerationHitPointsConsumption(
    lastSpurtAccelerationInitialSpeed: number,
    lastSpurtAccelerationAcceleration: number,
    baseSpeed: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    lastSpurtAccelerationTimeInSeconds: number
): number {
    return 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * ((lastSpurtAccelerationInitialSpeed + lastSpurtAccelerationAcceleration * lastSpurtAccelerationTimeInSeconds - baseSpeed + 12) ** 3 - (lastSpurtAccelerationInitialSpeed - baseSpeed + 12) ** 3) / (3 * lastSpurtAccelerationAcceleration) / 144;
}

// lastSpurtSteadyHitPointsConsumption / (20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144)
export function calculateLastSpurtSteadyTimeInSeconds(
    lastSpurtSteadyHitPointsConsumption: number,
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    lastSpurtSteadyInitialSpeed: number,
    baseSpeed: number
): number {
    return lastSpurtSteadyHitPointsConsumption / (20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144);
}

// min(20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 * (raceLengthInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndTheeSteadyDistanceInMeters + LastSpurtAccelerationDistanceInMeters)) / lastSpurtSteadyInitialSpeed, hitPointsWithSkills - (startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption + phaseTwoAccelerationHitPointsConsumption + phaseTwoAndThreeSteadyHitPointsConsumption + lastSpurtAccelerationHitPointsConsumption))
export function calculateLastSpurtSteadyHitPointsConsumption(
    fieldConditionHPConsumptionCoefficient: number,
    lastSpurtHitPointsConsumptionCoefficient: number,
    lastSpurtSteadyInitialSpeed: number,
    baseSpeed: number,
    raceLengthInMeters: number,
    phaseTwoAccelerationDistanceInMeters: number,
    phaseTwoAndTheeSteadyDistanceInMeters: number,
    LastSpurtAccelerationDistanceInMeters: number,
    hitPointsWithSkills: number,
    startingDashHitPointsConsumption: number,
    phaseZeroAccelerationHitPointsConsumption: number,
    phaseZeroSteadyHitPointsConsumption: number,
    phaseOneAccelerationHitPointsConsumption: number,
    phaseOneSteadyHitPointsConsumption: number,
    phaseTwoAccelerationHitPointsConsumption: number,
    phaseTwoAndThreeSteadyHitPointsConsumption: number,
    lastSpurtAccelerationHitPointsConsumption: number
): number {
    const leftHand = 20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 * (raceLengthInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndTheeSteadyDistanceInMeters + LastSpurtAccelerationDistanceInMeters)) / lastSpurtSteadyInitialSpeed;
    const rightHand = hitPointsWithSkills - (startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption + phaseTwoAccelerationHitPointsConsumption + phaseTwoAndThreeSteadyHitPointsConsumption + lastSpurtAccelerationHitPointsConsumption);
    return Math.min(leftHand, rightHand);
}

// lastSpurtSteadyInitialSpeed * lastSpurtSteadyTimeInSeconds
export function calculateLastSpurtSteadyDistanceInMeters(
    lastSpurtSteadyInitialSpeed: number,
    lastSpurtSteadyTimeInSeconds: number
): number {
    return lastSpurtSteadyInitialSpeed * lastSpurtSteadyTimeInSeconds;
}