import { LEFT, TOP, RIGHT, BOTTOM } from './Sides.js';


export default class GroupModel {
    constructor(key) {
        this.key = key;
        this.pieces = [];
        this.bounds = { [LEFT]: -1, [TOP]: -1, [RIGHT]: -1, [BOTTOM]: -1 };
    }

    addPiece(key, row, col) {
        this.pieces.push(key);
        if (this.bounds[LEFT] < 0 || col < this.bounds[LEFT]) {
            this.bounds[LEFT] = col;
        }
        if (this.bounds[RIGHT] < 0 || col > this.bounds[RIGHT]) {
            this.bounds[RIGHT] = col;
        }
        if (this.bounds[TOP] < 0 || row < this.bounds[TOP]) {
            this.bounds[TOP] = row;
        }
        if (this.bounds[BOTTOM] < 0 || row > this.bounds[BOTTOM]) {
            this.bounds[BOTTOM] = row;
        }
    }

    mergeWith(other) {
        this.pieces = this.pieces.concat(other.pieces);
        if (other.bounds[LEFT] < this.bounds[LEFT]) {
            this.bounds[LEFT] = other.bounds[LEFT];
        }
        if (other.bounds[RIGHT] > this.bounds[RIGHT]) {
            this.bounds[RIGHT] = other.bounds[RIGHT];
        }
        if (other.bounds[TOP] < this.bounds[TOP]) {
            this.bounds[TOP] = other.bounds[TOP];
        }
        if (other.bounds[BOTTOM] > this.bounds[BOTTOM]) {
            this.bounds[BOTTOM] = other.bounds[BOTTOM];
        }
    }
}