import type { InputData } from "./modifierTypes";
import { calculateBaseSpeed } from "./startingDashCalculator";

export interface Result {
    baseSpeed: number;
}

export function calculate(
    input: InputData
): Result {
    // calculate basic data:
    // - base speed
    const baseSpeed = calculateBaseSpeed(parseInt(input.distance));


    return {
        baseSpeed: baseSpeed
    };
}