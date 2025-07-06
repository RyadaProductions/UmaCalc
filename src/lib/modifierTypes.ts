import type { 
    Aptitude, 
    Condition, 
    Mood, 
    Strategy, 
    Surface 
} from "./constants";

export interface SurfaceAndWeatherModifiers {
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

export interface InputData {
    stats: {
        speed: number;
        stamina: number;
        power: number;
        guts: number;
        wit: number;
    };
    surfaceAptitudes: {
        turf: Aptitude;
        dirt: Aptitude;
    };
    distanceAptitudes: {
        sprint: Aptitude;
        mile: Aptitude;
        medium: Aptitude;
        long: Aptitude;
    };
    strategyAptitudes: {
        front: Aptitude;
        pace: Aptitude;
        late: Aptitude;
        end: Aptitude;
    };
    mood: Mood;
    strategy: Strategy;
    surface: Surface;
    condition: Condition;
    distance: string;
    skills: {
        goldRecovery: number;
        whiteRecovery: number;
        uniqueRecoveryTwoStarsOrBelow: number;
        uniqueRecoveryThreeStarsOrAbove: number;
    };
}

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
    targetHitPointsForLastSpurt: number;
    requiredStamina: number;
    skillProcRate: number;
    rushedRate: number;
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
        idealLastSpurtAcceleration: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
        idealLastSpurtSteady: {
            initialSpeed: number;
            targetSpeed: number;
            acceleration: number;
            timeInSeconds: number;
            distance: number;
            hpConsumption: number;
        },
    }
}