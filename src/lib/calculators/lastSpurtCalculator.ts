
// totalConsumedHitPointsTillPhaseTwo = startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption
// min((hpWithRecovery - totalConsumedHitPointsTillPhaseTwo) - (raceDistanceInMeters / 3 - 60) * 20 * fieldConditionHPCoeffienct * lastSpurtConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed) / (20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * ((LastSpurtSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 / lastSpurtSteadyInitialSpeed - (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed)) + 60, raceDistanceInMeters / 3)
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
    const lastSpurtBasedOnStamina = (hitPointsWithRecovery - totalConsumedHitPointsTillPhaseTwo - (raceDistanceInMeters / 3 - 60) * 20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed) / (20 * fieldConditionHPCoefficient * lastSpurtConsumptionCoefficient * ((lastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 / lastSpurtSteadyInitialSpeed - (phaseTwoAndThreeSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 / phaseTwoAndThreeSteadyInitialSpeed)) + 60;
    const minimumDistance = raceDistanceInMeters / 3;
    return Math.min(lastSpurtBasedOnStamina, minimumDistance);
}

// 1 + (200 / sqrt(600 * realGuts))
export function calculateLastSpurtHitPointsConsumptionCoefficient(
    realGuts: number
): number {
    return 1 + (200 / Math.sqrt(600 * realGuts));
}

export function calculateRemainingHitPointsBeforeLastSpurt(
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
    return hitPointsWithSkills - (startingDashHitPointsConsumption + phaseZeroAccelerationHitPointsConsumption + phaseZeroSteadyHitPointsConsumption + phaseOneAccelerationHitPointsConsumption + phaseOneSteadyHitPointsConsumption + phaseTwoAccelerationHitPointsConsumption + phaseTwoAndThreeSteadyHitPointsConsumption + lastSpurtAccelerationHitPointsConsumption);
}