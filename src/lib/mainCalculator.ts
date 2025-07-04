import { distances } from "./constants";
import { calculateHitPointsWithRecovery, calculateInitialHitPoints, calculateRecoverySkillHitPoints, calculateUniqueRecoverySkillHitPoints } from "./hitPointsCalculator";
import { 
    getDistanceAptitudeModifiers,
    getMoodModifier, 
    getStageModifiers, 
    getStrategyAptitudeModifiers, 
    getSurfaceAptitudeModifier, 
    getWeatherModifier 
} from "./modifierData";
import type { InputData } from "./modifierTypes";
import { 
    calculateAcceleration, 
    calculateBaseSpeed, 
    calculateDistanceInMeters, 
    calculateStartingDashDuration, 
    calculateStartingDashHitPointsConsumption, 
    calculateTargetSpeed 
} from "./startingDashCalculator";
import { 
    calculateRealSpeed,
    calculateRealStamina,
    calculateRealPower,
    calculateRealGuts, 
    calculateRealWit,
} from "./statsCalculator";

export interface Result {
    realStats: {
        speed: number;
        stamina: number;
        power: number;
        guts: number;
        wit: number;
    }
    baseSpeed: number;
    initialHitPoints: number;
    hitPointsWithRecovery: number;
    detailedBreakdown: {
        startingDash: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        }
    }
}

export function getTrackLength(distance: number) {
    return distances[distance];
};

export function calculate(
    input: InputData
): Result {
    const startinDashInitialSpeed = 3; // CONSTANT

    // GetModifiers
    const moodModifier = getMoodModifier(input.mood);
    const weatherModifier = getWeatherModifier(input.surface, input.condition);
    const distanceAptitudeModifiers = getDistanceAptitudeModifiers(getTrackLength(parseInt(input.distance)), input.distanceAptitudes)
    const strategyAptitudeModifiers = getStrategyAptitudeModifiers(input.strategy, input.strategyAptitudes);
    const stageModifiers = getStageModifiers(input.strategy);
    const surfaceAptitudeModifier = getSurfaceAptitudeModifier(input.surface, input.surfaceAptitudes);

    const distanceAsNumber = parseInt(input.distance);

    // calculate basic data:
    // - stats
    const realSpeed = calculateRealSpeed(
        input.stats.speed,
        moodModifier,
        weatherModifier,
        distanceAptitudeModifiers
    );
    const realStamina = calculateRealStamina(
        input.stats.stamina,
        moodModifier
    );
    const realPower = calculateRealPower(
        input.stats.power,
        moodModifier,
        weatherModifier,
        distanceAptitudeModifiers
    );
    const realGuts = calculateRealGuts(
        input.stats.guts,
        moodModifier
    );
    const realWit = calculateRealWit(
        input.stats.wit,
        moodModifier,
        strategyAptitudeModifiers.acceleration
    );

    // - general data
    const baseSpeed = calculateBaseSpeed(distanceAsNumber);
    const initialHitPoints = calculateInitialHitPoints(
        distanceAsNumber,
        realStamina,
        stageModifiers.hpCorrection
    );
    const recoveryHitPoints = calculateRecoverySkillHitPoints(
        input.skills.goldRecovery,
        input.skills.whiteRecovery
    );
    const uniqueRecoveryHitPoints = calculateUniqueRecoverySkillHitPoints(
        input.skills.uniqueRecoveryTwoStarsOrBelow,
        input.skills.uniqueRecoveryThreeStarsOrAbove
    );
    const hitPointsWithRecovery = calculateHitPointsWithRecovery(
        initialHitPoints,
        recoveryHitPoints,
        uniqueRecoveryHitPoints 
    );

    // - detailed breakdown
    const startingDashTargetSpeed = calculateTargetSpeed(baseSpeed);
    const startingDashAcceleration = calculateAcceleration(
        realPower,
        stageModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    const startingDashTimeInSeconds = calculateStartingDashDuration(
        realPower,
        distanceAsNumber,
        stageModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    const startingDashDistanceInMeters = calculateDistanceInMeters(
        startingDashTargetSpeed,
        startingDashTimeInSeconds
    );
    const startingDashHitPointsConsumption = calculateStartingDashHitPointsConsumption(
        startingDashTimeInSeconds,
        input.surface,
        input.condition
    );

    return {
        realStats: {
            speed: realSpeed,
            stamina: realStamina,
            power: realPower,
            guts: realGuts,
            wit: realWit
        },
        baseSpeed: baseSpeed,
        initialHitPoints: initialHitPoints,
        hitPointsWithRecovery: hitPointsWithRecovery,
        detailedBreakdown: {
            startingDash: {
                initialSpeed: startinDashInitialSpeed,
                targetSpeed: startingDashTargetSpeed,
                acceleration: startingDashAcceleration,
                timeInSeconds: startingDashTimeInSeconds,
                distance: startingDashDistanceInMeters,
                hpConsumption: startingDashHitPointsConsumption
            }
        }
    };
}