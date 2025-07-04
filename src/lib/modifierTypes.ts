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
};

export interface DistanceAptitudeModifiers {
    speed: number;
    acceleration: number;
};

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
}