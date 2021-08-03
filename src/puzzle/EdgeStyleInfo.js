import { getOppositeEdge } from './Edges';

// Contains the properties needed to draw a specific puzzle piece edge:
// its overall type (bump, recess, flat) and any constants needed to define its shape.
export default class EdgeStyleInfo {
    constructor(type, neckWidth, offset, control1, control2) {
        this.type = type;
        this.w = neckWidth;     // The width of the area where the bump meets the edge of the piece.
        this.o = offset;        // Controls the distance between the widest part of the bump and the edge of the piece.
        this.c1 = control1;     // Controls the width of the widest part of the bump.
        this.c2 = control2;     // Controls the width near the tallest part of the bump (affects the smoothness/pointiness of the curve).
    }

    // Returns an EdgeStyleInfo object for an edge that fits with this one:
    // if this is a bump edge, opposite() returns a matching recess edge, and vice-versa.
    // Will fail if called on a flat edge.
    opposite() {
        return Object.assign(new EdgeStyleInfo(), this, { type: getOppositeEdge(this.type) });
    }
}