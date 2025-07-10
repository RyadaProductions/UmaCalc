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

// 350 * 1.02 ^ (uniqueLevelTwoStarsOrBelow - 1) + 550 * 1.02 ^ (uniqueLevelArOrAboveThreeStars - 1)
export function calculateUniqueRecoverySkillHitPoints(
    uniqueLevelTwoStarsOrBelow: number,
    uniqueLevelArOrAboveThreeStars: number
): number {
    let total = 0;
    if (uniqueLevelTwoStarsOrBelow > 0) {
        total += 350 * Math.pow(1.02, uniqueLevelTwoStarsOrBelow - 1);
    }
    if (uniqueLevelArOrAboveThreeStars > 0) {
        total += 550 * Math.pow(1.02, uniqueLevelArOrAboveThreeStars - 1);
    }
    return total;
}

// TODO: rework calculations to use fractional values instead of calculating it from 350 and 550 and dividing by 10000