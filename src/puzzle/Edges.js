import { randomInt } from '../util';


export const BUMP = 'b';
export const RECESS = 'r';
export const FLAT = 'f';

// Excludes FLAT since that edge type isn't assigned randomly.
export function getRandomEdgeType() {
    const types = [BUMP, RECESS];
    return types[randomInt(types.length)];
}

export function getOppositeEdge(edge) {
    switch (edge) {
        case BUMP:
            return RECESS;
        case RECESS:
            return BUMP;
        case FLAT:
            throw Error(`getOppositeEdge: Flat edge has no opposite type`);
        default:
            throw Error(`getOppositeEdge: Unknown edge type ${edge}`);
    }
}