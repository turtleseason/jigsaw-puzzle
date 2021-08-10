import { LEFT, TOP, RIGHT, BOTTOM } from './Sides.js';

export default class GroupModel {
    // If a separate key is not provided, the piece's key is used as the group key.
    constructor(piece, key) {
        this.key = key ?? piece.key;
        this.pieces = [piece.key];
        this.bounds = { [LEFT]: piece.col, [TOP]: piece.row, [RIGHT]: piece.col, [BOTTOM]: piece.row };
    }

    addPiece(piece) {
        this.pieces.push(piece.key);

        this.bounds[LEFT] = Math.min(this.bounds[LEFT], piece.col);
        this.bounds[RIGHT] = Math.max(this.bounds[RIGHT], piece.col);
        this.bounds[TOP] = Math.min(this.bounds[TOP], piece.row);
        this.bounds[BOTTOM] = Math.max(this.bounds[BOTTOM], piece.row);
    }

    mergeWith(other) {
        this.pieces = this.pieces.concat(other.pieces);

        this.bounds[LEFT] = Math.min(this.bounds[LEFT], other.bounds[LEFT]);
        this.bounds[RIGHT] = Math.max(this.bounds[RIGHT], other.bounds[RIGHT]);
        this.bounds[TOP] = Math.min(this.bounds[TOP], other.bounds[TOP]);
        this.bounds[BOTTOM] = Math.max(this.bounds[BOTTOM], other.bounds[BOTTOM]);
    }
}