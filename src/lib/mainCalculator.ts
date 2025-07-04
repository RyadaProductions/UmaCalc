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
    const startinDashInitialSpeed = 3; // CONSTANT

    // GetModifiers
    const moodModifier = getMoodModifier(input.mood);
    const weatherModifier = getWeatherModifier(input.surface, input.condition);
    const distanceAptitudeModifiers = getDistanceAptitudeModifiers(getTrackLength(parseInt(input.distance)), input.distanceAptitudes)
    const strategyAptitudeModifiers = getStrategyAptitudeModifiers(input.strategy, input.strategyAptitudes);
    const stageModifiers = getStageModifiers(input.strategy);
    const surfaceAptitudeModifier = getSurfaceAptitudeModifier(input.surface, input.surfaceAptitudes);

    const raceDistanceAsNumber = parseInt(input.distance);

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
    const baseSpeed = calculateBaseSpeed(raceDistanceAsNumber);
    const initialHitPoints = calculateInitialHitPoints(
        raceDistanceAsNumber,
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
        raceDistanceAsNumber,
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
        raceDistanceAsNumber,
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
        raceDistanceAsNumber,
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
        raceDistanceAsNumber,
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
                initialSpeed: 0,
                targetSpeed: 0,
                acceleration: 0,
                timeInSeconds: 0,
                distance: 0,
                hpConsumption: 0
            },
            phaseTwoAndThreeSteady: {
                initialSpeed: 0,
                targetSpeed: 0,
                acceleration: 0,
                timeInSeconds: 0,
                distance: 0,
                hpConsumption: 0
            },
            lastSpurtAcceleration: {
                initialSpeed: 0,
                targetSpeed: 0,
                acceleration: 0,
                timeInSeconds: 0,
                distance: 0,
                hpConsumption: 0
            },
            lastSpurtSteady: {
                initialSpeed: 0,
                targetSpeed: 0,
                acceleration: 0,
                timeInSeconds: 0,
                distance: 0,
                hpConsumption: 0
            },
            hitPointsZeroDeceleration: {
                initialSpeed: 0,
                targetSpeed: 0,
                acceleration: 0,
                timeInSeconds: 0,
                distance: 0,
                hpConsumption: 0
            }
        }
    };
}