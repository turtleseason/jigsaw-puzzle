import { getOppositeEdge } from './Edges.js';


// Contains the properties needed to draw a specific puzzle piece edge:
// its overall type (bump, recess, flat) and any constants needed to define its shape.
export default class EdgeStyleInfo {
	constructor(type, neckWidth, offset, control1, control2) {
		this.type = type;
		this.w = neckWidth;
		this.o = offset;
		this.c1 = control1;
		this.c2 = control2;
	}

    // Returns an EdgeStyleInfo object for an edge that fits with this one:
    // if this is a bump edge, opposite() returns a matching recess edge, and vice-versa.
    // Will fail if called on a flat edge.
	opposite() {
		const other = {...this};
		other.type = getOppositeEdge(this.type);
		return other;
	}
}