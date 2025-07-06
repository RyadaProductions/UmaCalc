// (startingDashConsumption + phaseZeroAccelerationConsumption + phaseZeroSteadyConsumption + phaseOneAccelerationConsumption + phaseOneSteadyConsumption)
// (lastSpurtAccelerationConsumption + lastSpurtSteadyConsumption)
export function calculateTargetHitPointsForLastSpurt(
    startingDashConsumption: number,
    phaseZeroAccelerationConsumption: number,
    phaseZeroSteadyConsumption: number,
    phaseOneAccelerationConsumption: number,
    phaseOneSteadyConsumption: number,
    lastSpurtAccelerationConsumption: number,
    lastSpurtSteadyConsumption: number,
) {
    const initialConsumption = startingDashConsumption + phaseZeroAccelerationConsumption + phaseZeroSteadyConsumption + phaseOneAccelerationConsumption + phaseOneSteadyConsumption;
    const lastSpurtConsumption = lastSpurtAccelerationConsumption + lastSpurtSteadyConsumption;
    return initialConsumption + lastSpurtConsumption;
}

// realStamina + (targetHitPointsForLastSpurt - hitPointsWithRecovery) / 0.8 / strategyHitPointsCorrection / (1 + recoveryHitPoints + uniqueRecoveryHitPoints) / 10000)
export function calculateRequiredStamina(
    realStamina: number,
    targetHitPointsForLastSpurt: number,
    hitPointsWithRecovery: number,
    strategyHitPointsCorrection: number,
    recoveryHitPoints: number,
    uniqueRecoveryHitPoints: number
): number {
    return realStamina + (targetHitPointsForLastSpurt - hitPointsWithRecovery) / 0.8 / strategyHitPointsCorrection / (1 + (recoveryHitPoints + uniqueRecoveryHitPoints) / 10000);
}