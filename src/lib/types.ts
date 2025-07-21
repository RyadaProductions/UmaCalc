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

export interface Skills {
    goldRecovery: number;
    whiteRecovery: number;
    uniqueRecoveryLevelTwoStarsOrBelow: number;
    uniqueRecoveryLevelThreeStarsOrAbove: number;
    singleCircle: GreenSkills;
    doubleCircle: GreenSkills;
}

export interface GreenSkills {
    speed: number;
    stamina: number;
    power: number;
    guts: number;
    wit: number;
    all: number;
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
    skills: Skills;
}

export interface PhaseData {
    initialSpeed: number;
    targetSpeed: number;
    acceleration: number;
    duration: number;
    distance: number;
    hpConsumption: number;
}

export interface DetailedBreakdown {
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
    totalProjection: PhaseData;
    idealLastSpurtAcceleration: PhaseData;
    idealLastSpurtSteady: PhaseData;
}

export interface Result {
    realStats: Stats;
    baseSpeed: number;
    remainingHP: number;
    initialHitPoints: number;
    hitPointsWithRecovery: number;
    lastSpurtDistance: number;
    lastSpurtHitPointsConsumptionCoefficient: number;
    targetHitPointsForLastSpurt: number;
    requiredStamina: number;
    skillProcRate: number;
    rushedRate: number;
    detailedBreakdown: DetailedBreakdown;
}