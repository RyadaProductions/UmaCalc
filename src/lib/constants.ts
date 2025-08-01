import { 
    type TrackConditionModifiers,
    type DistanceAptitudeModifiers,
    type StrategyModifiers,
    type InputData,
} from "./types";

export const aptitudes = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export const moods = ['Great', 'Good', 'Normal', 'Bad', 'Terrible'] as const;
export const strategies = ['Front', 'Pace', 'Late', 'End'] as const;
export const surfaces = [ 'Turf', 'Dirt' ] as const;
export const conditions = [ 'Firm', 'Soft', 'Heavy', 'Wet' ] as const;
export const distances = ['Sprint', 'Mile', 'Medium', 'Long'] as const;

export type Aptitude = typeof aptitudes[number];
export type Mood = typeof moods[number];
export type Strategy = typeof strategies[number];
export type Surface = typeof surfaces[number];
export type Condition = typeof conditions[number];
export type Distance = typeof distances[number];

export const distanceMap: Record<number, Distance> = {
  1000: 'Sprint', 1200: 'Sprint', 1400: 'Sprint',
  1500: 'Mile', 1600: 'Mile', 1700: 'Mile', 1800: 'Mile',
  1900: 'Medium', 2000: 'Medium', 2100: 'Medium', 2200: 'Medium', 2400: 'Medium',
  2500: 'Long', 2600: 'Long', 3000: 'Long', 3200: 'Long', 3400: 'Long', 3600: 'Long'
};

export const moodModifiers: Record<Mood, number> = {
    Great: 1.04,
    Good: 1.02,
    Normal: 1.00,
    Bad: 0.98,
    Terrible: 0.96
};

export const surfaceModifiers: Record<Surface, Record<Condition, TrackConditionModifiers>> = {
    Turf: {
        Heavy: { speed: 0, power: -50, hpConsumptionCoefficient: 1.02 },
        Wet: { speed: -50, power: -50, hpConsumptionCoefficient: 1.02 },
        Firm: { speed: 0, power: 0, hpConsumptionCoefficient: 1 },
        Soft: { speed: 0, power: -50, hpConsumptionCoefficient: 1 },
    },
    Dirt: {
        Heavy: { speed: 0, power: -100, hpConsumptionCoefficient: 1.01 },
        Wet: { speed: -50, power: -100, hpConsumptionCoefficient: 1.02 },
        Firm: { speed: 0, power: -100, hpConsumptionCoefficient: 1 },
        Soft: { speed: 0, power: -50, hpConsumptionCoefficient: 1 },
    }
};

export const distanceAptitudeModifiers: Record<Aptitude, DistanceAptitudeModifiers> = {
    S: { speed: 1.05, acceleration: 1 },
    A: { speed: 1, acceleration: 1 },
    B: { speed: 0.9, acceleration: 1 },
    C: { speed: 0.8, acceleration: 1 },
    D: { speed: 0.6, acceleration: 1 },
    E: { speed: 0.4, acceleration: 0.6 },
    F: { speed: 0.2, acceleration: 0.5 },
    G: { speed: 0.1, acceleration: 0.4 }
};

export const strategyAptitudeModifiers: Record<Aptitude, number> = {
    S: 1.1,
    A: 1,
    B: 0.85,
    C: 0.75,
    D: 0.6,
    E: 0.4,
    F: 0.2,
    G: 0.1,
}

export const trackAptitudeModifiers: Record<Aptitude, number> = {
    S: 1.05,
    A: 1,
    B: 0.9,
    C: 0.8,
    D: 0.6,
    E: 0.4,
    F: 0.2,
    G: 0.1
}

export const strategyModifiers: Record<Strategy, StrategyModifiers> = {
    Front: {
        hpCorrection: 0.95,
        speedCorrection: {
            early: 1,
            middle: 0.98,
            late: 0.962
        },
        accelerationCorrection: {
            early: 1,
            middle: 1,
            late: 0.996
        }
    },
    Pace: {
        hpCorrection: 0.89,
        speedCorrection: {
            early: 0.978,
            middle: 0.991,
            late: 0.975
        },
        accelerationCorrection: {
            early: 0.985,
            middle: 1,
            late: 0.996
        }
    },
    Late: {
        hpCorrection: 1,
        speedCorrection: {
            early: 0.938,
            middle: 0.998,
            late: 0.994
        },
        accelerationCorrection: {
            early: 0.975,
            middle: 1,
            late: 1
        }
    },
    End: {
        hpCorrection: 0.995,
        speedCorrection: {
            early: 0.931,
            middle: 1,
            late: 1
        },
        accelerationCorrection: {
            early: 0.945,
            middle: 1,
            late: 0.997
        }
    },
};

export const DEFAULT_INPUT: InputData = {
    stats: {
        speed: 1200,
        stamina: 800,
        power: 1000,
        guts: 400,
        wit: 1000
    },
    surface: 'Turf',
    surfaceAptitude: 'A',
    distance: '2000',
    distanceAptitude: 'A',
    strategy: 'Front',
    strategyAptitude: 'A',
    mood: 'Great',
    condition: 'Firm',
    skills: {
        goldRecovery: 0,
        whiteRecovery: 0,
        uniqueRecoveryLevelTwoStarsOrBelow: 0,
        uniqueRecoveryLevelThreeStarsOrAbove: 0,
        singleCircle: {
            speed: 0,
            stamina: 0,
            power: 0,
            guts: 0,
            wit: 0,
            all: 0
        },
        doubleCircle: {
            speed: 0,
            stamina: 0,
            power: 0,
            guts: 0,
            wit: 0,
            all: 0
        },
    }
};

export const thresholds: [number, string][] = [
    [1100, 'SS'],
    [1000, 'S'],
    [800, 'A'],
    [600, 'B'],
    [400, 'C'],
    [300, 'D'],
    [200, 'E'],
    [100, 'F'],
    [0, 'G']
];

export const gradeColors: Record<string, string> = {
    SS: 'text-orange-500',
    S: 'text-orange-500',
    A: 'text-orange-500',
    B: 'text-pink-500',
    C: 'text-green-600',
    D: 'text-blue-500',
    E: 'text-red-500',
    F: 'text-gray-500',
    G: 'text-gray-400'
};