// DistanceInMeters + 0.8 * realStamina * strategyHpCorrection
export function calculateInitialHitPoints(
    distanceInMeters: number,
    realStamina: number,
    strategyHpCorrection: number
): number {
    return distanceInMeters + 0.8 * realStamina * strategyHpCorrection;
};

// InitialHitPoints * (1 + (RecoverySkills + UniqueRecoverySkills) / 10000)
export function calculateHitPointsWithRecovery(
    initialHitPoints: number,
    recoverySkills: number,
    uniqueRecoverySkills: number
): number {
    return initialHitPoints * (1 + (recoverySkills + uniqueRecoverySkills) / 10000);
};

// GoldSkills * 550 + WhiteSkills * 150
export function calculateRecoverySkillHitPoints(
    goldSkills: number,
    whiteSkills: number
) {
    return goldSkills * 550 + whiteSkills * 150;
}

// 350 * 1.02 ^ (uniquesAtOrBelowTwoStars - 1) + 550 * 1.02 ^ (uniquesAtOrAboveThreeStars - 1)
export function calculateUniqueRecoverySkillHitPoints(
    uniquesAtOrBelowTwoStars: number,
    uniquesAtOrAboveThreeStars: number
): number {
    let total = 0;
    if (uniquesAtOrBelowTwoStars > 0) {
        total += 350 * Math.pow(1.02, uniquesAtOrBelowTwoStars - 1);
    }
    if (uniquesAtOrAboveThreeStars > 0) {
        total += 550 * Math.pow(1.02, uniquesAtOrAboveThreeStars - 1);
    }
    return total;
}