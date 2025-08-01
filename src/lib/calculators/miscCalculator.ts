// Excel sheet uses / 100 at the end to get a fraction we can just use the raw number
export function calculateRushedRate(
    realWit: number,
): number {
    return (6.5 / Math.log10(0.1 * realWit + 1)) ** 2;
}

// Excel sheet uses / 100 at the end to get a fraction we can just use the raw number
export function calculateSkillProcRate(
    baseWit: number,
): number {
    return Math.max(100 - 9000 / baseWit, 20);
}

// Calculation for base speed:
// 20 - (Distance - 2000) / 1000
export function calculateBaseSpeed(
    distance: number
): number {
    return 20 - (distance - 2000) / 1000;
}

// MinSpeed=0.85*BaseSpeed+sqrt(200.0*GutsStat)*0.001[m/s] 
export function calculateMinimumSpeed(
    baseSpeed: number,
    realGuts: number
): number {
    return 0.85 * baseSpeed + Math.sqrt(200 * realGuts) * 0.001;
}

export function calculateProjectedTotal(
    startingDash: number,
    phaseZeroAcceleration: number,
    phaseZeroSteady: number,
    phaseOneAcceleration: number,
    phaseOneSteady: number,
    phaseTwoAcceleration: number,
    phaseTwoAndThreeSteady: number,
    lastSpurtAcceleration: number,
    lastSpurtSteady: number,
    hitPointsZeroDeceleration: number
): number {
    return startingDash + phaseZeroAcceleration + phaseZeroSteady + phaseOneAcceleration + phaseOneSteady + phaseTwoAcceleration + phaseTwoAndThreeSteady + lastSpurtAcceleration + lastSpurtSteady + hitPointsZeroDeceleration;
}