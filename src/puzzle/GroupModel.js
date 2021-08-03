import { LEFT, TOP, RIGHT, BOTTOM } from './Sides.js';

export default class GroupModel {
    constructor(piece) {
        this.key = piece.key;
        this.pieces = [piece.key];
        this.bounds = { [LEFT]: piece.col, [TOP]: piece.row, [RIGHT]: piece.col, [BOTTOM]: piece.row };
    }

    mergeWith(other) {
        this.pieces = this.pieces.concat(other.pieces);

        this.bounds[LEFT] = Math.min(this.bounds[LEFT], other.bounds[LEFT]);
        this.bounds[RIGHT] = Math.max(this.bounds[RIGHT], other.bounds[RIGHT]);
        this.bounds[TOP] = Math.min(this.bounds[TOP], other.bounds[TOP]);
        this.bounds[BOTTOM] = Math.max(this.bounds[BOTTOM], other.bounds[BOTTOM]);
    }
}