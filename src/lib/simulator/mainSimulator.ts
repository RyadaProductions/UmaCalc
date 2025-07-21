import type { InputData } from "$lib/types";
import { CourseHelpers } from '$lib/uma-skill-tools/CourseData';
import { GameHpPolicy } from "$lib/uma-skill-tools/HpPolicy";
import { RaceSolver } from "$lib/uma-skill-tools/RaceSolver";
import { buildAdjustedStats, buildBaseStats, parseGroundCondition } from "$lib/uma-skill-tools/RaceSolverBuilder";
import { Rule30CARng } from "$lib/uma-skill-tools/Random";


export function Test(
    input: InputData
): number {
    const courseHelpers = new CourseHelpers();
    const course = courseHelpers.getCourse(10101);
    const horseDesc = {
        speed: input.stats.speed,
        stamina: input.stats.stamina,
        power: input.stats.power,
        guts: input.stats.guts,
        wisdom: input.stats.wit,
        strategy: 'NIGE',
        distanceAptitude: 'A',
        surfaceAptitude: 'A',
        strategyAptitude: 'A'
    };
    // Nige = front
    // Senkou = pace
    // Sasi = late
    // oikomi = End

    const mood = 2;
    const ground = parseGroundCondition('good');

    const baseStats = buildBaseStats(horseDesc, mood);
    const horseParams = buildAdjustedStats(baseStats, course, ground);

    const rngForHp = new Rule30CARng(12345);
    const hpPolicy = new GameHpPolicy(course, ground, rngForHp);
    hpPolicy.init(horseParams);

    const rngForSolve = new Rule30CARng(12345);
    const solver = new RaceSolver({
        horse: horseParams,
        course,
        hp: hpPolicy,
        rng: rngForSolve,
        skills: []
    });

    const dt = 1/60;

    while (solver.pos < course.distance) {
        solver.step(dt);
    }

    const ratioLeft = hpPolicy.hpRatioRemaining();
    const hpLeft = ratioLeft * hpPolicy.maxHp;

    return hpPolicy.hp;
}
