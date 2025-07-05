import { distances } from "./constants";
import { 
    calculateHitPointsWithRecovery, 
    calculateInitialHitPoints, 
    calculateRecoverySkillHitPoints, 
    calculateUniqueRecoverySkillHitPoints 
} from "./hitPointsCalculator";
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
} from "./phaseZeroCalculator";
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
} from "./phaseOneCalculator";
import type { InputData } from "./modifierTypes";
import { calculatePhaseTwoAccelerationAcceleration, calculatePhaseTwoAccelerationDistanceInMeters, calculatePhaseTwoAccelerationHitPointsConsumption, calculatePhaseTwoAccelerationTargetSpeed, calculatePhaseTwoAccelerationTimeInSeconds, calculatePhaseTwoAndThreeSteadyDistanceInMeters, calculatePhaseTwoAndThreeSteadyHitPointsConsumption, calculatePhaseTwoAndThreeSteadyTimeInSeconds } from "./phaseTwoCalculator";
import { calculateLastSpurtAccelerationAcceleration, calculateLastSpurtAccelerationDistanceInMeters, calculateLastSpurtAccelerationHitPointsConsumption, calculateLastSpurtAccelerationInitialSpeed, calculateLastSpurtAccelerationTargetSpeed, calculateLastSpurtAccelerationTimeInSeconds, calculateLastSpurtDistance, calculateLastSpurtHitPointsConsumptionCoefficient, calculateLastSpurtSteadyDistanceInMeters, calculateLastSpurtSteadyHitPointsConsumption, calculateLastSpurtSteadyTimeInSeconds } from "./lastSpurtCalculator";

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
    lastSpurtDistance: number;
    lastSpurtHitPointsConsumptionCoefficient: number;
    detailedBreakdown: {
        startingDash: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseZeroAcceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseZeroSteady: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseOneAcceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseOneSteady: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseTwoAcceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        phaseTwoAndThreeSteady: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        lastSpurtAcceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        lastSpurtSteady: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        hitPointsZeroDeceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
    }
}

export function getTrackLength(distance: number) {
    return distances[distance];
}

export function calculate(
    input: InputData
): Result {
    const startingDashInitialSpeed = 3; // CONSTANT

    // GetModifiers
    const moodModifier = getMoodModifier(input.mood);
    const weatherModifier = getWeatherModifier(input.surface, input.condition);
    const distanceAptitudeModifiers = getDistanceAptitudeModifiers(getTrackLength(parseInt(input.distance)), input.distanceAptitudes)
    const strategyAptitudeModifiers = getStrategyAptitudeModifiers(input.strategy, input.strategyAptitudes);
    const stageModifiers = getStageModifiers(input.strategy);
    const surfaceAptitudeModifier = getSurfaceAptitudeModifier(input.surface, input.surfaceAptitudes);

    const raceDistanceInMeters = parseInt(input.distance);

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
        input.surface,
        input.condition
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
    const lastSpurtSteadyHitPointsConsumption = calculateLastSpurtSteadyHitPointsConsumption( // Something is wrong with this formula
        weatherModifier.hpConsumptionCoefficient,
        lastSpurtHitPointsConsumptionCoefficient,
        lastSpurtSteadyInitialSpeed,
        baseSpeed,
        raceDistanceInMeters,
        phaseTwoAccelerationDistanceInMeters,
        phaseTwoAndThreeSteadyDistanceInMeters,
        lastSpurtAccelerationDistanceInMeters,
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

    const hitPointsZeroDecelerationTimeInSeconds = 0;//calculateHitPointsZeroDecelerationTimeInSeconds();
    const hitPointsZeroDecelerationDistanceInMeters = 0;//calculateHitPointsZeroDecelerationDistanceInMeters();
    const hitPointsZeroDecelerationHitPointsConsumption = 0; // No hitpoints can be consumed as we have ran out

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
            }
        }
    };
}