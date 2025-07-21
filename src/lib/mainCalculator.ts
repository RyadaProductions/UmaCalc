import { distanceMap } from "./constants";
import type { InputData, PhaseData, Result } from "./types";
import { 
    calculateHitPointsWithRecovery, 
    calculateInitialHitPoints, 
    calculateRecoverySkillHitPoints, 
    calculateUniqueRecoverySkillHitPoints 
} from "./calculators/hitPointsCalculator";
import { 
    getDistanceAptitudeModifiers,
    getMoodModifier, 
    getStrategyModifiers, 
    getStrategyAptitudeModifier, 
    getSurfaceAptitudeModifier, 
    getConditionModifiers 
} from "./modifierData";
import { calculatePhaseZeroAccelerationData } from './calculators/phaseZeroAccelerationCalculator'
import { calculatePhaseZeroSteadyData } from "./calculators/phaseZeroSteadyCalculator";
import { calculateStartingDashData } from "./calculators/startingDashCalculator";
import { calculateRealStats } from "./calculators/statsCalculator";
import { calculatePhaseOneSteadyData } from "./calculators/phaseOneSteadyCalculator";
import { calculatePhaseTwoAndThreeSteadyContinuedData, calculatePhaseTwoAndThreeSteadyInitialData } from "./calculators/phaseTwoAndThreeSteadyCalculator";
import { 
    calculateLastSpurtDistance, 
    calculateLastSpurtHitPointsConsumptionCoefficient,
    calculateRemainingHitPointsBeforeLastSpurt
} from "./calculators/lastSpurtCalculator";
import { calculateLastSpurtSteadyData } from './calculators/lastSpurtSteadyCalculator'
import { calculateIdealLastSpurtAccelerationData, calculateLastSpurtAccelerationContinuedData, calculateLastSpurtAccelerationInitialData } from "./calculators/lastSpurtAccelerationCalculator"
import { calculateHitPointsZeroDecelerationData } from "./calculators/hitPointsZeroCalculator";
import { 
    calculateRequiredStamina, 
    calculateTargetHitPointsForLastSpurt 
} from "./calculators/staminaTargetCalculator";
import { 
    calculateRushedRate, 
    calculateSkillProcRate,
    calculateBaseSpeed,
    calculateMinimumSpeed,
    calculateProjectedTotal
} from "./calculators/miscCalculator";
import { calculatePhaseOneAccelerationData } from "./calculators/phaseOneAccelerationCalculator";
import { calculatePhaseTwoAccelerationContinuedData, calculatePhaseTwoAccelerationInitialData } from "./calculators/phaseTwoAccelerationCalculator";
import { calculateIdealLastSpurtSteadyData } from "./calculators/idealLastSpurtSteadyCalculator";

export function getTrackLength(distance: number) {
    return distanceMap[distance];
}

export function calculate(
    input: InputData
): Result {
    const raceDistanceInMeters = parseInt(input.distance);
    // GetModifiers
    const moodModifier = getMoodModifier(input.mood);
    const conditionModifiers = getConditionModifiers(input.surface, input.condition);
    const distanceAptitudeModifiers = getDistanceAptitudeModifiers(input.distanceAptitude)
    const strategyAptitudeModifier = getStrategyAptitudeModifier(input.strategyAptitude);
    const strategyModifiers = getStrategyModifiers(input.strategy);
    const surfaceAptitudeModifier = getSurfaceAptitudeModifier(input.surfaceAptitude);

    // calculate basic data:
    // - stats
    const realStats = calculateRealStats(
        input.stats,
        moodModifier,
        conditionModifiers,
        distanceAptitudeModifiers,
        strategyAptitudeModifier,
        input.skills
    );

    // - general data
    const baseSpeed = calculateBaseSpeed(raceDistanceInMeters);
    const minimumSpeed = calculateMinimumSpeed(baseSpeed, realStats.guts);
    const initialHitPoints = calculateInitialHitPoints(
        raceDistanceInMeters,
        realStats.stamina,
        strategyModifiers.hpCorrection
    );
    const recoveryHitPoints = calculateRecoverySkillHitPoints(
        input.skills.goldRecovery,
        input.skills.whiteRecovery
    );
    const uniqueRecoveryHitPoints = calculateUniqueRecoverySkillHitPoints(
        input.skills.uniqueRecoveryLevelTwoStarsOrBelow,
        input.skills.uniqueRecoveryLevelThreeStarsOrAbove
    );
    const hitPointsWithRecovery = calculateHitPointsWithRecovery(
        initialHitPoints,
        recoveryHitPoints,
        uniqueRecoveryHitPoints 
    );
    const skillProcRate = calculateSkillProcRate(input.stats.wit);
    const rushedRate = calculateRushedRate(realStats.wit);

    const lastSpurtHitPointsConsumptionCoefficient = calculateLastSpurtHitPointsConsumptionCoefficient(realStats.guts);

    // - detailed breakdown
    // - starting dash
    const startingDashData = calculateStartingDashData(
        baseSpeed,
        realStats.power,
        strategyModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier,
        conditionModifiers
    );
    
    // - phase zero acceleration
    const phaseZeroAccelerationData = calculatePhaseZeroAccelerationData(
        baseSpeed,
        realStats,
        strategyModifiers.speedCorrection.early,
        strategyModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier,
        raceDistanceInMeters,
        startingDashData.distance,
        conditionModifiers
    )

    // - phase zero steady
    const phaseZeroSteadyData = calculatePhaseZeroSteadyData(
        baseSpeed,
        raceDistanceInMeters,
        phaseZeroAccelerationData,
        startingDashData,
        conditionModifiers
    );

    // - phase one acceleration
    const phaseOneAccelerationData = calculatePhaseOneAccelerationData(
        baseSpeed,
        realStats,
        phaseZeroAccelerationData,
        strategyModifiers,
        distanceAptitudeModifiers,
        surfaceAptitudeModifier,
        conditionModifiers
    );

    // - phase one steady
    const phaseOneSteadyData = calculatePhaseOneSteadyData(
        baseSpeed,
        raceDistanceInMeters,
        phaseOneAccelerationData,
        conditionModifiers
    );

    // - phase two acceleration
    let phaseTwoAccelerationData = calculatePhaseTwoAccelerationInitialData(
        baseSpeed,
        realStats,
        strategyModifiers,
        distanceAptitudeModifiers,
        surfaceAptitudeModifier,
        phaseOneSteadyData
    );

    // - phase two and three steady
    let phaseTwoAndThreeSteadyData = calculatePhaseTwoAndThreeSteadyInitialData(phaseTwoAccelerationData);

    // - last spurt acceleration
    let lastSpurtAccelerationData = calculateLastSpurtAccelerationInitialData(
        baseSpeed,
        realStats,
        strategyModifiers,
        distanceAptitudeModifiers
    );

    // Last Spurt Distance is in an awkward spot
    // We have to do this here, as this requires data from the starting dash till Phase One Steady
    const lastSpurtDistance = calculateLastSpurtDistance(
        raceDistanceInMeters,
        hitPointsWithRecovery,
        startingDashData.hpConsumption,
        phaseZeroAccelerationData.hpConsumption,
        phaseZeroSteadyData.hpConsumption,
        phaseOneAccelerationData.hpConsumption,
        phaseOneSteadyData.hpConsumption,
        conditionModifiers.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        phaseTwoAndThreeSteadyData.initialSpeed,
        lastSpurtAccelerationData.targetSpeed,
        baseSpeed,
    );

    // - phase two acceleration continued
    // We need to calculate the last spurt distance first to see if we actually have a phase 2
    phaseTwoAccelerationData = calculatePhaseTwoAccelerationContinuedData(
        phaseTwoAccelerationData,
        baseSpeed,
        raceDistanceInMeters,
        lastSpurtDistance,
        conditionModifiers,
        lastSpurtHitPointsConsumptionCoefficient
    );

    // - phase two and three steady continued
    phaseTwoAndThreeSteadyData = calculatePhaseTwoAndThreeSteadyContinuedData(
        phaseTwoAndThreeSteadyData,
        baseSpeed,
        raceDistanceInMeters,
        lastSpurtDistance,
        phaseTwoAccelerationData,
        conditionModifiers,
        lastSpurtHitPointsConsumptionCoefficient
    );

    // - last spurt acceleration continued
    // This needs the time spend in phase two acceleration
    lastSpurtAccelerationData = calculateLastSpurtAccelerationContinuedData(
        lastSpurtAccelerationData,
        baseSpeed,
        realStats,
        strategyModifiers,
        distanceAptitudeModifiers,
        surfaceAptitudeModifier,
        conditionModifiers,
        lastSpurtHitPointsConsumptionCoefficient,
        phaseOneSteadyData,
        phaseTwoAccelerationData,
        phaseTwoAndThreeSteadyData
    );

    // Remaining hitpoints before we start the last spurt
    const remainingHitPointsBeforeLastSpurt = calculateRemainingHitPointsBeforeLastSpurt(
        hitPointsWithRecovery,
        startingDashData.hpConsumption,
        phaseZeroAccelerationData.hpConsumption,
        phaseZeroSteadyData.hpConsumption,
        phaseOneAccelerationData.hpConsumption,
        phaseOneSteadyData.hpConsumption,
        phaseTwoAccelerationData.hpConsumption,
        phaseTwoAndThreeSteadyData.hpConsumption,
        lastSpurtAccelerationData.hpConsumption
    );

    // - last spurt steady
    const lastSpurtSteadyData = calculateLastSpurtSteadyData(
        baseSpeed,
        raceDistanceInMeters,
        lastSpurtHitPointsConsumptionCoefficient,
        remainingHitPointsBeforeLastSpurt,
        phaseTwoAccelerationData,
        phaseTwoAndThreeSteadyData,
        lastSpurtAccelerationData,
        conditionModifiers
    );

    // - hit points zero deceleration
    const hitPointsZeroDecelerationData = calculateHitPointsZeroDecelerationData(
        raceDistanceInMeters,
        minimumSpeed,
        phaseTwoAccelerationData,
        phaseTwoAndThreeSteadyData,
        lastSpurtAccelerationData,
        lastSpurtSteadyData
    );

    // - ideal last spurt acceleration
    // This recalculation is based of starting the last spurt directly from the phase two acceleration phase
    const idealLastSpurtAccelerationData = calculateIdealLastSpurtAccelerationData(
        baseSpeed,
        conditionModifiers,
        lastSpurtHitPointsConsumptionCoefficient,
        phaseOneSteadyData,
        phaseTwoAccelerationData,
        lastSpurtAccelerationData
    );

    // - ideal last spurt steady
   const idealLastSpurtSteadyData = calculateIdealLastSpurtSteadyData(
        baseSpeed,
        raceDistanceInMeters,
        lastSpurtHitPointsConsumptionCoefficient,
        lastSpurtAccelerationData,
        idealLastSpurtAccelerationData,
        conditionModifiers
    );


    const targetHitPointsForLastSpurt = calculateTargetHitPointsForLastSpurt(
        startingDashData.hpConsumption,
        phaseZeroAccelerationData.hpConsumption,
        phaseZeroSteadyData.hpConsumption,
        phaseOneAccelerationData.hpConsumption,
        phaseOneSteadyData.hpConsumption,
        idealLastSpurtAccelerationData.hpConsumption,
        idealLastSpurtSteadyData.hpConsumption
    );
    const requiredStamina = calculateRequiredStamina(
        realStats.stamina,
        targetHitPointsForLastSpurt,
        hitPointsWithRecovery,
        strategyModifiers.hpCorrection,
        recoveryHitPoints,
        uniqueRecoveryHitPoints
    );

    const totalDistance = calculateProjectedTotal(
        startingDashData.distance,
        phaseZeroAccelerationData.distance,
        phaseZeroSteadyData.distance,
        phaseOneAccelerationData.distance,
        phaseOneSteadyData.distance,
        phaseTwoAccelerationData.distance,
        phaseTwoAndThreeSteadyData.distance,
        lastSpurtAccelerationData.distance,
        lastSpurtSteadyData.distance,
        hitPointsZeroDecelerationData.distance
    );

    const totalDuration = calculateProjectedTotal(
        startingDashData.duration,
        phaseZeroAccelerationData.duration,
        phaseZeroSteadyData.duration,
        phaseOneAccelerationData.duration,
        phaseOneSteadyData.duration,
        phaseTwoAccelerationData.duration,
        phaseTwoAndThreeSteadyData.duration,
        lastSpurtAccelerationData.duration,
        lastSpurtSteadyData.duration,
        hitPointsZeroDecelerationData.duration
    );

    const totalProjectionData: PhaseData = {
        acceleration: 0,
        distance: totalDistance,
        duration: totalDuration,
        hpConsumption: 0,
        initialSpeed: 0,
        targetSpeed: 0
    };

    return {
        realStats: realStats,
        baseSpeed: baseSpeed,
        initialHitPoints: initialHitPoints,
        hitPointsWithRecovery: hitPointsWithRecovery,
        lastSpurtDistance: lastSpurtDistance,
        lastSpurtHitPointsConsumptionCoefficient: lastSpurtHitPointsConsumptionCoefficient,
        targetHitPointsForLastSpurt: targetHitPointsForLastSpurt,
        requiredStamina: requiredStamina,
        skillProcRate: skillProcRate,
        rushedRate: rushedRate,
        detailedBreakdown: {
            startingDash: startingDashData,
            phaseZeroAcceleration: phaseZeroAccelerationData,
            phaseZeroSteady: phaseZeroSteadyData,
            phaseOneAcceleration: phaseOneAccelerationData,
            phaseOneSteady: phaseOneSteadyData,
            phaseTwoAcceleration: phaseTwoAccelerationData,
            phaseTwoAndThreeSteady: phaseTwoAndThreeSteadyData,
            lastSpurtAcceleration: lastSpurtAccelerationData,
            lastSpurtSteady: lastSpurtSteadyData,
            hitPointsZeroDeceleration: hitPointsZeroDecelerationData,
            totalProjection: totalProjectionData,
            idealLastSpurtAcceleration: idealLastSpurtAccelerationData,
            idealLastSpurtSteady: idealLastSpurtSteadyData
        }
    };
}