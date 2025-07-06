import type { 
    Aptitude, 
    Condition, 
    Mood, 
    Strategy, 
    Surface 
} from "./constants";

export interface TrackConditionModifiers {
    speed: number;
    power: number;
    hpConsumptionCoefficient: number;
}

export interface DistanceAptitudeModifiers {
    speed: number;
    acceleration: number;
}

export interface TrackStageModifiers {
    early: number;
    middle: number;
    late: number;
}

export interface StrategyModifiers {
    hpCorrection: number;
    speedCorrection: TrackStageModifiers;
    accelerationCorrection: TrackStageModifiers;
}

export interface Stats {
    speed: number;
    stamina: number;
    power: number;
    guts: number;
    wit: number;
}

export interface InputData {
    stats: Stats;
    surface: Surface;
    surfaceAptitude: Aptitude;
    distance: string;
    distanceAptitude: Aptitude;
    strategy: Strategy;
    strategyAptitude: Aptitude;
    mood: Mood;
    condition: Condition;
    skills: {
        goldRecovery: number;
        whiteRecovery: number;
        uniqueRecoveryTwoStarsOrBelow: number;
        uniqueRecoveryThreeStarsOrAbove: number;
    };
}

export interface PhaseData {
    initialSpeed: number;
    targetSpeed: number;
    acceleration: number;
    timeInSeconds: number;
    distance: number;
    hpConsumption: number;
}

export interface Result {
    realStats: Stats;
    baseSpeed: number;
    initialHitPoints: number;
    hitPointsWithRecovery: number;
    lastSpurtDistance: number;
    lastSpurtHitPointsConsumptionCoefficient: number;
    targetHitPointsForLastSpurt: number;
    requiredStamina: number;
    skillProcRate: number;
    rushedRate: number;
    detailedBreakdown: {
        startingDash: PhaseData;
        phaseZeroAcceleration: PhaseData;
        phaseZeroSteady: PhaseData;
        phaseOneAcceleration: PhaseData;
        phaseOneSteady: PhaseData;
        phaseTwoAcceleration: PhaseData;
        phaseTwoAndThreeSteady: PhaseData;
        lastSpurtAcceleration: PhaseData;
        lastSpurtSteady: PhaseData;
        hitPointsZeroDeceleration: PhaseData;
        idealLastSpurtAcceleration: PhaseData;
        idealLastSpurtSteady: PhaseData;
    }
}