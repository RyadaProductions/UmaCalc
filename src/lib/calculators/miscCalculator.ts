// Excel sheet uses / 100 at the end to get a fraction we can just use the raw number
export function calculateRushedRate(
    realWit: number,
): number {
    return (6.5 / Math.log10(0.1 * realWit + 1)) ** 2;
}

// Excel sheet uses / 100 at the end to get a fraction we can just use the raw number
export function calculateSkillProcRate(
    realWit: number,
): number {
    return Math.max(100 - 9000 / realWit, 20);
}

// Calculation for base speed:
// 20 - (Distance - 2000) / 1000
export function calculateBaseSpeed(
    distance: number
): number {
    return 20 - (distance - 2000) / 1000;
}