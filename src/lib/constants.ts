import { 
    type SurfaceAndWeatherModifiers,
    type DistanceAptitudeModifiers
} from "./modifierTypes";

export const aptitudes = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
export const moods = ['Great', 'Good', 'Normal', 'Bad', 'Terrible'] as const;
export const strategies = ['Front', 'Pace', 'Late', 'End'] as const;
export const surfaces = [ 'Turf', 'Dirt' ] as const;
export const conditions = [ 'Firm', 'Soft', 'Heavy', 'Wet' ] as const;

export type Aptitude = typeof aptitudes[number];
export type Mood = typeof moods[number];
export type Strategy = typeof strategies[number];
export type Surface = typeof surfaces[number];
export type Condition = typeof conditions[number];

export const distances: Record<number, 'Sprint' | 'Mile' | 'Medium' | 'Long'> = {
  1000: 'Sprint', 1200: 'Sprint', 1400: 'Sprint',
  1500: 'Mile', 1600: 'Mile', 1800: 'Mile',
  2000: 'Medium', 2200: 'Medium', 2300: 'Medium', 2400: 'Medium',
  2500: 'Long', 2600: 'Long', 3000: 'Long', 3200: 'Long', 3400: 'Long', 3600: 'Long'
};

export const moodModifiers: Record<string, number> = {
    great: 1.04,
    good: 1.02,
    normal: 1.00,
    bad: 0.98,
    terrible: 0.96
};

export const surfaceModifiers: Record<string, Record<string, SurfaceAndWeatherModifiers>> = {
    turf: {
        heavy: { speed: 0, power: -50, hpConsumptionCoefficient: 1.02 },
        wet: { speed: -50, power: -50, hpConsumptionCoefficient: 1.02 },
        firm: { speed: 0, power: 0, hpConsumptionCoefficient: 1 },
        soft: { speed: 0, power: -50, hpConsumptionCoefficient: 1 },
    },
    dirt: {
        heavy: { speed: 0, power: -100, hpConsumptionCoefficient: 1.01 },
        wet: { speed: -50, power: -100, hpConsumptionCoefficient: 1.02 },
        firm: { speed: 0, power: -100, hpConsumptionCoefficient: 1 },
        soft: { speed: 0, power: -50, hpConsumptionCoefficient: 1 },
    }
};

export const distanceAptitudeModifiers: Record<string, DistanceAptitudeModifiers> = {
    s: { speed: 1.05, acceleration: 1 },
    a: { speed: 1, acceleration: 1 },
    b: { speed: 0.9, acceleration: 1 },
    c: { speed: 0.8, acceleration: 1 },
    d: { speed: 0.6, acceleration: 1 },
    e: { speed: 0.4, acceleration: 0.6 },
    f: { speed: 0.2, acceleration: 0.5 },
    g: { speed: 0.1, acceleration: 0.4 }
};