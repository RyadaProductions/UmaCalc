import { distanceMap } from "./constants";
import type { InputData, Result } from "./modifierTypes";
import { 
    calculateHitPointsWithRecovery, 
    calculateInitialHitPoints, 
    calculateRecoverySkillHitPoints, 
    calculateUniqueRecoverySkillHitPoints 
} from "./calculators/hitPointsCalculator";
import { 
    getDistanceAptitudeModifiers,
    getMoodModifier, 
    getStageModifiers, 
    getStrategyAptitudeModifiers, 
    getSurfaceAptitudeModifier, 
    getWeatherModifier 
} from "./modifierData";
import {
    calculatePhaseZeroAccelerationAcceleration,
    calculatePhaseZeroAccelerationDistanceInMeters,
    calculatePhaseZeroAccelerationHitPointsConsumption,
    calculatePhaseZeroAccelerationInitialSpeed,
    calculatePhaseZeroAccelerationTargetSpeed,
    calculatePhaseZeroAccelerationTimeInSeconds,
    calculatePhaseZeroSteadyDistanceInMeters,
    calculatePhaseZeroSteadyHitPointsConsumption,
    calculatePhaseZeroSteadyTime
} from "./calculators/phaseZeroCalculator";
import { 
    calculateAcceleration, 
    calculateBaseSpeed, 
    calculateDistanceInMeters, 
    calculateStartingDashDuration, 
    calculateStartingDashHitPointsConsumption, 
    calculateTargetSpeed 
} from "./calculators/startingDashCalculator";
import { 
    calculateRealSpeed,
    calculateRealStamina,
    calculateRealPower,
    calculateRealGuts, 
    calculateRealWit,
} from "./calculators/statsCalculator";
import { 
    calculatePhaseOneAccelerationAcceleration,
    calculatePhaseOneAccelerationDistanceInMeters,
    calculatePhaseOneAccelerationHitPointsConsumption,
    calculatePhaseOneAccelerationInitialSpeed, 
    calculatePhaseOneAccelerationTargetSpeed, 
    calculatePhaseOneAccelerationTimeInSeconds,
    calculatePhaseOneSteadyDistanceInMeters,
    calculatePhaseOneSteadyHitPointsConsumption,
    calculatePhaseOneSteadyTimeInSeconds
} from "./calculators/phaseOneCalculator";
import { 
    calculatePhaseTwoAccelerationAcceleration, 
    calculatePhaseTwoAccelerationDistanceInMeters, 
    calculatePhaseTwoAccelerationHitPointsConsumption, 
    calculatePhaseTwoAccelerationTargetSpeed, 
    calculatePhaseTwoAccelerationTimeInSeconds, 
    calculatePhaseTwoAndThreeSteadyDistanceInMeters, 
    calculatePhaseTwoAndThreeSteadyHitPointsConsumption, 
    calculatePhaseTwoAndThreeSteadyTimeInSeconds 
} from "./calculators/phaseTwoCalculator";
import { 
    calculateLastSpurtAccelerationAcceleration, 
    calculateLastSpurtAccelerationDistanceInMeters, 
    calculateLastSpurtAccelerationHitPointsConsumption, 
    calculateLastSpurtAccelerationInitialSpeed, 
    calculateLastSpurtAccelerationTargetSpeed, 
    calculateLastSpurtAccelerationTimeInSeconds, 
    calculateLastSpurtDistance, 
    calculateLastSpurtHitPointsConsumptionCoefficient, 
    calculateLastSpurtSteadyDistanceInMeters, 
    calculateLastSpurtSteadyHitPointsConsumption, 
    calculateLastSpurtSteadyTimeInSeconds, 
    calculateRemainingHitPointsBeforeLastSpurt
} from "./calculators/lastSpurtCalculator";
import { 
    calculateHitPointsZeroDecelerationDistanceInMeters, 
    calculateHitPointsZeroDecelerationTimeInSeconds,
} from "./calculators/hitPointsZeroCalculator";
import { 
    calculateRequiredStamina, 
    calculateTargetHitPointsForLastSpurt 
} from "./calculators/staminaTargetCalculator";
import { 
    calculateRushedRate, 
    calculateSkillProcRate 
} from "./calculators/miscCalculator";

export function getTrackLength(distance: number) {
    return distanceMap[distance];
}

export function calculate(
    input: InputData
): Result {
    const startingDashInitialSpeed = 3; // CONSTANT

    const raceDistanceInMeters = parseInt(input.distance);
    // GetModifiers
    const moodModifier = getMoodModifier(input.mood);
    const weatherModifier = getWeatherModifier(input.surface, input.condition);
    const distanceAptitudeModifiers = getDistanceAptitudeModifiers(getTrackLength(raceDistanceInMeters), input.distanceAptitudes)
    const strategyAptitudeModifiers = getStrategyAptitudeModifiers(input.strategy, input.strategyAptitudes);
    const stageModifiers = getStageModifiers(input.strategy);
    const surfaceAptitudeModifier = getSurfaceAptitudeModifier(input.surface, input.surfaceAptitudes);

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
    const baseSpeed = calculateBaseSpeed(raceDistanceInMeters);
    const initialHitPoints = calculateInitialHitPoints(
        raceDistanceInMeters,
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
    const skillProcRate = calculateSkillProcRate(realWit);
    const rushedRate = calculateRushedRate(realWit);

    // - detailed breakdown
    // - starting dash
    const startingDashTargetSpeed = calculateTargetSpeed(baseSpeed);
    const startingDashAcceleration = calculateAcceleration(
        realPower,
        stageModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    const startingDashTimeInSeconds = calculateStartingDashDuration(
        realPower,
        raceDistanceInMeters,
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
        weatherModifier.hpConsumptionCoefficient
    );

    // - phase zero acceleration
    const phaseZeroAccelerationInitialSpeed = calculatePhaseZeroAccelerationInitialSpeed(baseSpeed);
    const phaseZeroAccelerationTargetSpeed = calculatePhaseZeroAccelerationTargetSpeed(
        baseSpeed, 
        realWit, 
        stageModifiers.speedCorrection.early
    );
    const phaseZeroAccelerationAcceleration = calculatePhaseZeroAccelerationAcceleration(
        realPower,
        stageModifiers.accelerationCorrection.early,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    const phaseZeroAccelerationTimeInSeconds = calculatePhaseZeroAccelerationTimeInSeconds(
        phaseZeroAccelerationInitialSpeed,
        phaseZeroAccelerationTargetSpeed,
        phaseZeroAccelerationAcceleration,
        raceDistanceInMeters,
        startingDashDistanceInMeters
    );
    const phaseZeroAccelerationDistanceInMeters = calculatePhaseZeroAccelerationDistanceInMeters(
        phaseZeroAccelerationInitialSpeed,
        phaseZeroAccelerationAcceleration,
        phaseZeroAccelerationTimeInSeconds
    );
    const phaseZeroAccelerationHitPointsConsumption = calculatePhaseZeroAccelerationHitPointsConsumption(
        phaseZeroAccelerationInitialSpeed,
        phaseZeroAccelerationAcceleration,
        phaseZeroAccelerationTimeInSeconds,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient
    );

    // - phase zero steady
    const phaseZeroSteadyInitialSpeed = phaseZeroAccelerationTargetSpeed; // The same as acceleration target speed as we entered steady state
    const phaseZeroSteadyTargetSpeed = phaseZeroAccelerationTargetSpeed; // The same as acceleration target speed as we entered steady state
    const phaseZeroSteadyAcceleration = 0; // No acceleration in steady state

    const phaseZeroSteadyDistanceInMeters = calculatePhaseZeroSteadyDistanceInMeters(
        raceDistanceInMeters,
        startingDashDistanceInMeters,
        phaseZeroAccelerationDistanceInMeters
    );
    const phaseZeroSteadyTimeInSeconds = calculatePhaseZeroSteadyTime(
        phaseZeroSteadyDistanceInMeters,
        phaseZeroSteadyInitialSpeed
    ); 
    const phaseZeroSteadyHitPointsConsumption = calculatePhaseZeroSteadyHitPointsConsumption(
        phaseZeroSteadyInitialSpeed,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        phaseZeroSteadyTimeInSeconds
    ); 

    // - phase one acceleration
    const phaseOneAccelerationInitialSpeed = calculatePhaseOneAccelerationInitialSpeed(
        phaseZeroAccelerationInitialSpeed,
        phaseZeroAccelerationAcceleration,
        phaseZeroAccelerationTimeInSeconds
    );
    const phaseOneAccelerationTargetSpeed = calculatePhaseOneAccelerationTargetSpeed(
        baseSpeed,
        realWit,
        stageModifiers.speedCorrection.middle
    );
    const phaseOneAccelerationAcceleration = calculatePhaseOneAccelerationAcceleration(
        phaseOneAccelerationInitialSpeed,
        phaseOneAccelerationTargetSpeed,
        realPower,
        stageModifiers.accelerationCorrection.middle,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    const phaseOneAccelerationTimeInSeconds = calculatePhaseOneAccelerationTimeInSeconds(
        phaseOneAccelerationInitialSpeed,
        phaseOneAccelerationTargetSpeed,
        phaseOneAccelerationAcceleration
    );
    const phaseOneAccelerationDistanceInMeters = calculatePhaseOneAccelerationDistanceInMeters(
        phaseOneAccelerationInitialSpeed,
        phaseOneAccelerationTargetSpeed,
        phaseOneAccelerationTimeInSeconds
    );
    const phaseOneAccelerationHitPointsConsumption = calculatePhaseOneAccelerationHitPointsConsumption(
        phaseOneAccelerationInitialSpeed,
        phaseOneAccelerationTargetSpeed,
        phaseOneAccelerationAcceleration,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient
    );

    // - phase one steady
    const phaseOneSteadyInitialSpeed = phaseOneAccelerationTargetSpeed; // The same as acceleration target speed as we entered steady state
    const phaseOneSteadyTargetSpeed = phaseOneAccelerationTargetSpeed; // The same as acceleration target speed as we entered steady state
    const phaseOneSteadyAcceleration = 0; // No acceleration in steady state

    const phaseOneSteadyDistanceInMeters = calculatePhaseOneSteadyDistanceInMeters(
        raceDistanceInMeters,
        phaseOneAccelerationDistanceInMeters,
    );

    const phaseOneSteadyTimeInSeconds = calculatePhaseOneSteadyTimeInSeconds(
        phaseOneSteadyDistanceInMeters,
        phaseOneSteadyInitialSpeed
    );
    const phaseOneSteadyHitPointsConsumption = calculatePhaseOneSteadyHitPointsConsumption(
        phaseOneSteadyInitialSpeed,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        phaseOneSteadyTimeInSeconds
    );

    // - phase two acceleration
    const phaseTwoAccelerationInitialSpeed = phaseOneSteadyTargetSpeed; // The same as phase one steady target speed
    const phaseTwoAccelerationTargetSpeed = calculatePhaseTwoAccelerationTargetSpeed(
        baseSpeed,
        realSpeed,
        realWit,
        stageModifiers.speedCorrection.late,
        distanceAptitudeModifiers.speed
    );
    const phaseTwoAccelerationAcceleration = calculatePhaseTwoAccelerationAcceleration(
        phaseTwoAccelerationInitialSpeed,
        phaseTwoAccelerationTargetSpeed,
        realPower,
        stageModifiers.accelerationCorrection.late,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );

    // - phase two and three steady
    const phaseTwoAndThreeSteadyInitialSpeed = phaseTwoAccelerationTargetSpeed; // The same as phase two acceleration target speed
    const phaseTwoAndThreeSteadyTargetSpeed = phaseTwoAccelerationTargetSpeed; // The same as phase two acceleration target speed
    const phaseTwoAndThreeSteadyAcceleration = 0; // No acceleration in steady state

    // - last spurt acceleration
    const lastSpurtHitPointsConsumptionCoefficient = calculateLastSpurtHitPointsConsumptionCoefficient(realGuts);
    const lastSpurtAccelerationTargetSpeed = calculateLastSpurtAccelerationTargetSpeed(
        baseSpeed,
        realSpeed,
        stageModifiers.speedCorrection.late,
        distanceAptitudeModifiers.speed
    );
    const lastSpurtAccelerationAcceleration = calculateLastSpurtAccelerationAcceleration(
        realPower,
        stageModifiers.accelerationCorrection.late,
        distanceAptitudeModifiers.acceleration,
        surfaceAptitudeModifier
    );
    // Last Spurt Distance is in an awkward spot
    // We have to do this here, as this requires data from the starting dash till Phase One Steady
    const lastSpurtDistance = calculateLastSpurtDistance(
        raceDistanceInMeters,
        hitPointsWithRecovery,
        startingDashHitPointsConsumption,
        phaseZeroAccelerationHitPointsConsumption,
        phaseZeroSteadyHitPointsConsumption,
        phaseOneAccelerationHitPointsConsumption,
        phaseOneSteadyHitPointsConsumption,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        phaseTwoAndThreeSteadyInitialSpeed,
        lastSpurtAccelerationTargetSpeed,
        baseSpeed,
    );

    // - last spurt steady
    const lastSpurtSteadyInitialSpeed = lastSpurtAccelerationTargetSpeed; // The same as last spurt acceleration target speed
    const lastSpurtSteadyTargetSpeed = lastSpurtAccelerationTargetSpeed; // The same as last spurt acceleration target speed
    const lastSpurtSteadyAcceleration = 0; // No acceleration in steady state

    // - phase two acceleration continued
    // We need to calculate the last spurt distance first to see if we actually have a phase 2
    const PhaseTwoAccelerationTimeInSeconds = calculatePhaseTwoAccelerationTimeInSeconds(
        raceDistanceInMeters,
        lastSpurtDistance,
        phaseTwoAccelerationTargetSpeed,
        phaseTwoAccelerationInitialSpeed,
        phaseTwoAccelerationAcceleration
    );
    const phaseTwoAccelerationDistanceInMeters = calculatePhaseTwoAccelerationDistanceInMeters(
        phaseTwoAccelerationInitialSpeed,
        phaseTwoAccelerationTargetSpeed,
        PhaseTwoAccelerationTimeInSeconds
    );
    const phaseTwoAccelerationHitPointsConsumption = calculatePhaseTwoAccelerationHitPointsConsumption(
        phaseTwoAccelerationInitialSpeed,
        phaseTwoAccelerationAcceleration,
        PhaseTwoAccelerationTimeInSeconds,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient
    );

    // - phase two and three steady continued
    const phaseTwoAndThreeSteadyDistanceInMeters = calculatePhaseTwoAndThreeSteadyDistanceInMeters(
        raceDistanceInMeters,
        lastSpurtDistance,
        phaseTwoAccelerationDistanceInMeters
    );
    const phaseTwoAndThreeSteadyTimeInSeconds = calculatePhaseTwoAndThreeSteadyTimeInSeconds(
        phaseTwoAndThreeSteadyDistanceInMeters,
        phaseTwoAndThreeSteadyTargetSpeed
    );
    const phaseTwoAndThreeSteadyHitPointsConsumption = calculatePhaseTwoAndThreeSteadyHitPointsConsumption(
        phaseTwoAndThreeSteadyInitialSpeed,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        phaseTwoAndThreeSteadyTimeInSeconds
    );

    // - last spurt acceleration continued
    // This needs the time spend in phase two acceleration
    const lastSpurtAccelerationInitialspeed = calculateLastSpurtAccelerationInitialSpeed(
        phaseTwoAccelerationDistanceInMeters,
        phaseOneSteadyInitialSpeed,
        phaseTwoAndThreeSteadyInitialSpeed
    );
    const lastSpurtAccelerationTimeInSeconds = calculateLastSpurtAccelerationTimeInSeconds(
        lastSpurtAccelerationTargetSpeed,
        lastSpurtAccelerationInitialspeed,
        lastSpurtAccelerationAcceleration
    );
    const lastSpurtAccelerationDistanceInMeters = calculateLastSpurtAccelerationDistanceInMeters(
        lastSpurtAccelerationInitialspeed,
        lastSpurtAccelerationTargetSpeed,
        lastSpurtAccelerationTimeInSeconds
    );
    const lastSpurtAccelerationHitPointsConsumption = calculateLastSpurtAccelerationHitPointsConsumption(
        lastSpurtAccelerationInitialspeed,
        lastSpurtAccelerationAcceleration,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        lastSpurtAccelerationTimeInSeconds
    );

    // - last spurt steady continued
    const remainingHitPointsBeforeLastSpurt = calculateRemainingHitPointsBeforeLastSpurt(
        hitPointsWithRecovery,
        startingDashHitPointsConsumption,
        phaseZeroAccelerationHitPointsConsumption,
        phaseZeroSteadyHitPointsConsumption,
        phaseOneAccelerationHitPointsConsumption,
        phaseOneSteadyHitPointsConsumption,
        phaseTwoAccelerationHitPointsConsumption,
        phaseTwoAndThreeSteadyHitPointsConsumption,
        lastSpurtAccelerationHitPointsConsumption
    );

    const targetLastSpurtSteadyHitPointsConsumption = calculateLastSpurtSteadyHitPointsConsumption(
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        lastSpurtSteadyInitialSpeed,
        baseSpeed,
        raceDistanceInMeters,
        phaseTwoAccelerationDistanceInMeters,
        phaseTwoAndThreeSteadyDistanceInMeters,
        lastSpurtAccelerationDistanceInMeters
    );

    // min(
    //  20 * fieldConditionHPConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (lastSpurtSteadyInitialSpeed - baseSpeed + 12) ^ 2 / 144 * (raceLengthInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndTheeSteadyDistanceInMeters + LastSpurtAccelerationDistanceInMeters)) / lastSpurtSteadyInitialSpeed,
    //  remainingHitPointsBeforeLastSpurt
    // )
    const lastSpurtSteadyHitPointsConsumption = Math.min(
        targetLastSpurtSteadyHitPointsConsumption, 
        remainingHitPointsBeforeLastSpurt
    );

    // This requires the hitpointsconsumption
    const lastSpurtSteadyTimeInSeconds = calculateLastSpurtSteadyTimeInSeconds(
        lastSpurtSteadyHitPointsConsumption,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        lastSpurtSteadyInitialSpeed,
        baseSpeed
    );
    const lastSpurtSteadyDistanceInMeters = calculateLastSpurtSteadyDistanceInMeters(
        lastSpurtSteadyInitialSpeed,
        lastSpurtSteadyTimeInSeconds
    );
    
    // - hit points zero deceleration
    const hitPointsZeroDecelerationInitialSpeed = lastSpurtSteadyTargetSpeed; // Starting to descelerate from top speed
    const hitPointsZeroDecelerationTargetSpeed = 0; // No formula exists for this.
    const hitPointsZeroDecelerationAcceleration = -1.2; // CONSTANT

    const hitPointsZeroDecelerationDistanceInMeters = calculateHitPointsZeroDecelerationDistanceInMeters(
        raceDistanceInMeters,
        phaseTwoAccelerationDistanceInMeters,
        phaseTwoAndThreeSteadyDistanceInMeters,
        lastSpurtAccelerationDistanceInMeters,
        lastSpurtSteadyDistanceInMeters
    );
    const hitPointsZeroDecelerationTimeInSeconds = calculateHitPointsZeroDecelerationTimeInSeconds(
        hitPointsZeroDecelerationInitialSpeed,
        hitPointsZeroDecelerationAcceleration,
        hitPointsZeroDecelerationDistanceInMeters
    );
    const hitPointsZeroDecelerationHitPointsConsumption = 0; // No hitpoints can be consumed as we have ran out

    // -- We need to calculate the ideal last spurt values
    // This recalculation is based of starting the last spurt directly from the phase two acceleration phase

    const idealLastSpurtAccelerationInitialSpeed = phaseOneSteadyInitialSpeed; // ideally we want to start directly from phase 1 steady state
    const idealLastSpurtAccelerationTargetSpeed = lastSpurtAccelerationTargetSpeed; // We always aim for the same last spurt speed
    const idealLastSpurtAccelerationAcceleration = lastSpurtAccelerationAcceleration; // We can reuse the calculation from the current last spurt
    const idealLastSpurtSteadyInitialSpeed = lastSpurtAccelerationTargetSpeed; // We always aim for the same last spurt speed
    const idealLastSpurtSteadyTargetSpeed = lastSpurtAccelerationTargetSpeed; // We always aim for the same last spurt speed
    const idealLastSpurtSteadyAcceleration = 0; // Steady state so no acceleration


    const idealLastSpurtAccelerationTimeInSeconds = calculateLastSpurtAccelerationTimeInSeconds(
        idealLastSpurtAccelerationTargetSpeed,
        idealLastSpurtAccelerationInitialSpeed,
        idealLastSpurtAccelerationAcceleration
    );

    const idealLastSpurtAccelerationHitPointsConsumption = calculateLastSpurtAccelerationHitPointsConsumption(
        phaseTwoAccelerationInitialSpeed,
        lastSpurtAccelerationAcceleration,
        baseSpeed,
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        idealLastSpurtAccelerationTimeInSeconds
    );
    // Need new methods to calculate this as cleanup
    const idealLastSpurtAccelerationDistanceInMeters = (idealLastSpurtAccelerationInitialSpeed + idealLastSpurtAccelerationTargetSpeed) / 2 * idealLastSpurtAccelerationTimeInSeconds;
    const idealLastSpurtSteadyDistanceInMeters = raceDistanceInMeters / 3 - idealLastSpurtAccelerationDistanceInMeters;
    const idealLastSpurtSteadyTimeInSeconds = idealLastSpurtSteadyDistanceInMeters / idealLastSpurtSteadyInitialSpeed;
    const idealLastSpurtSteadyHitPointsConsumption = 20 * weatherModifier.hpConsumptionCoefficient * lastSpurtHitPointsConsumptionCoefficient * (idealLastSpurtSteadyInitialSpeed - baseSpeed + 12) ** 2 / 144 * idealLastSpurtSteadyTimeInSeconds;

    const targetHitPointsForLastSpurt = calculateTargetHitPointsForLastSpurt(
        startingDashHitPointsConsumption,
        phaseZeroAccelerationHitPointsConsumption,
        phaseZeroSteadyHitPointsConsumption,
        phaseOneAccelerationHitPointsConsumption,
        phaseOneSteadyHitPointsConsumption,
        idealLastSpurtAccelerationHitPointsConsumption,
        idealLastSpurtSteadyHitPointsConsumption
    );
    const requiredStamina = calculateRequiredStamina(
        realStamina,
        targetHitPointsForLastSpurt,
        hitPointsWithRecovery,
        stageModifiers.hpCorrection,
        recoveryHitPoints,
        uniqueRecoveryHitPoints
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
        lastSpurtDistance: lastSpurtDistance,
        lastSpurtHitPointsConsumptionCoefficient: lastSpurtHitPointsConsumptionCoefficient,
        targetHitPointsForLastSpurt: targetHitPointsForLastSpurt,
        requiredStamina: requiredStamina,
        skillProcRate: skillProcRate,
        rushedRate: rushedRate,
        detailedBreakdown: {
            startingDash: {
                initialSpeed: startingDashInitialSpeed,
                targetSpeed: startingDashTargetSpeed,
                acceleration: startingDashAcceleration,
                timeInSeconds: startingDashTimeInSeconds,
                distance: startingDashDistanceInMeters,
                hpConsumption: startingDashHitPointsConsumption
            },
            phaseZeroAcceleration: {
                initialSpeed: phaseZeroAccelerationInitialSpeed,
                targetSpeed: phaseZeroAccelerationTargetSpeed,
                acceleration: phaseZeroAccelerationAcceleration,
                timeInSeconds: phaseZeroAccelerationTimeInSeconds,
                distance: phaseZeroAccelerationDistanceInMeters,
                hpConsumption: phaseZeroAccelerationHitPointsConsumption
            },
            phaseZeroSteady: {
                initialSpeed: phaseZeroSteadyInitialSpeed,
                targetSpeed: phaseZeroSteadyTargetSpeed,
                acceleration: phaseZeroSteadyAcceleration,
                timeInSeconds: phaseZeroSteadyTimeInSeconds,
                distance: phaseZeroSteadyDistanceInMeters,
                hpConsumption: phaseZeroSteadyHitPointsConsumption
            },
            phaseOneAcceleration: {
                initialSpeed: phaseOneAccelerationInitialSpeed,
                targetSpeed: phaseOneAccelerationTargetSpeed,
                acceleration: phaseOneAccelerationAcceleration,
                timeInSeconds: phaseOneAccelerationTimeInSeconds,
                distance: phaseOneAccelerationDistanceInMeters,
                hpConsumption: phaseOneAccelerationHitPointsConsumption
            },
            phaseOneSteady: {
                initialSpeed: phaseOneSteadyInitialSpeed,
                targetSpeed: phaseOneSteadyTargetSpeed,
                acceleration: phaseOneSteadyAcceleration,
                timeInSeconds: phaseOneSteadyTimeInSeconds,
                distance: phaseOneSteadyDistanceInMeters,
                hpConsumption: phaseOneSteadyHitPointsConsumption
            },
            phaseTwoAcceleration: {
                initialSpeed: phaseTwoAccelerationInitialSpeed,
                targetSpeed: phaseTwoAccelerationTargetSpeed,
                acceleration: phaseTwoAccelerationAcceleration,
                timeInSeconds: PhaseTwoAccelerationTimeInSeconds,
                distance: phaseTwoAccelerationDistanceInMeters,
                hpConsumption: phaseTwoAccelerationHitPointsConsumption,
            },
            phaseTwoAndThreeSteady: {
                initialSpeed: phaseTwoAndThreeSteadyInitialSpeed,
                targetSpeed: phaseTwoAndThreeSteadyTargetSpeed,
                acceleration: phaseTwoAndThreeSteadyAcceleration,
                timeInSeconds: phaseTwoAndThreeSteadyTimeInSeconds,
                distance: phaseTwoAndThreeSteadyDistanceInMeters,
                hpConsumption: phaseTwoAndThreeSteadyHitPointsConsumption
            },
            lastSpurtAcceleration: {
                initialSpeed: lastSpurtAccelerationInitialspeed,
                targetSpeed: lastSpurtAccelerationTargetSpeed,
                acceleration: lastSpurtAccelerationAcceleration,
                timeInSeconds: lastSpurtAccelerationTimeInSeconds,
                distance: lastSpurtAccelerationDistanceInMeters,
                hpConsumption: lastSpurtAccelerationHitPointsConsumption
            },
            lastSpurtSteady: {
                initialSpeed: lastSpurtSteadyInitialSpeed,
                targetSpeed: lastSpurtSteadyTargetSpeed,
                acceleration: lastSpurtSteadyAcceleration,
                timeInSeconds: lastSpurtSteadyTimeInSeconds,
                distance: lastSpurtSteadyDistanceInMeters,
                hpConsumption: lastSpurtSteadyHitPointsConsumption
            },
            hitPointsZeroDeceleration: {
                initialSpeed: hitPointsZeroDecelerationInitialSpeed,
                targetSpeed: hitPointsZeroDecelerationTargetSpeed,
                acceleration: hitPointsZeroDecelerationAcceleration,
                timeInSeconds: hitPointsZeroDecelerationTimeInSeconds,
                distance: hitPointsZeroDecelerationDistanceInMeters,
                hpConsumption: hitPointsZeroDecelerationHitPointsConsumption
            },
            idealLastSpurtAcceleration: {
                initialSpeed: idealLastSpurtAccelerationInitialSpeed,
                targetSpeed: idealLastSpurtAccelerationTargetSpeed,
                acceleration: idealLastSpurtAccelerationAcceleration,
                timeInSeconds: idealLastSpurtAccelerationTimeInSeconds,
                distance: idealLastSpurtAccelerationDistanceInMeters,
                hpConsumption: idealLastSpurtAccelerationHitPointsConsumption
            },
            idealLastSpurtSteady: {
                initialSpeed: idealLastSpurtSteadyInitialSpeed,
                targetSpeed: idealLastSpurtSteadyTargetSpeed,
                acceleration: idealLastSpurtSteadyAcceleration,
                timeInSeconds: idealLastSpurtSteadyTimeInSeconds,
                distance: idealLastSpurtSteadyDistanceInMeters,
                hpConsumption: idealLastSpurtSteadyHitPointsConsumption
            }
        }
    };
}