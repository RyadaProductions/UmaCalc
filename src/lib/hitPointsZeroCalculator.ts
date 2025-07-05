// (-hitPointsZeroDescelerationInitialSpeed + sqrt(hitPointsZeroDescelerationInitialSpeed ^ 2 + 2 * hitPointsZeroDescelerationAcceleration * hitPointsZeroDescelerationDistanceInMeters)) / hitPointsZeroDescelerationAcceleration
export function calculateHitPointsZeroDecelerationTimeInSeconds(
    hitPointsZeroDescelerationInitialSpeed: number,
    hitPointsZeroDescelerationAcceleration: number,
    hitPointsZeroDescelerationDistanceInMeters: number,
): number {
    return (-hitPointsZeroDescelerationInitialSpeed + Math.sqrt(hitPointsZeroDescelerationInitialSpeed ** 2 + 2 * hitPointsZeroDescelerationAcceleration * hitPointsZeroDescelerationDistanceInMeters)) / hitPointsZeroDescelerationAcceleration;
}

// raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndThreeSteadyDistanceInMeters + lastSpurtAccelerationDistanceInMeters + lastSpurtSteadyDistanceInMeters)
export function calculateHitPointsZeroDecelerationDistanceInMeters(
    raceDistanceInMeters: number,
    phaseTwoAccelerationDistanceInMeters: number,
    phaseTwoAndThreeSteadyDistanceInMeters: number,
    lastSpurtAccelerationDistanceInMeters: number,
    lastSpurtSteadyDistanceInMeters: number,
): number {
    return raceDistanceInMeters / 3 - (phaseTwoAccelerationDistanceInMeters + phaseTwoAndThreeSteadyDistanceInMeters + lastSpurtAccelerationDistanceInMeters + lastSpurtSteadyDistanceInMeters);
}