export default class PieceModel {
	// By default, a new piece is inserted into the group with the same id as its key
	constructor(key, col, row, pos, bgPos, zIndex, edges, neighbors) {
		this.key = key;
		this.group = key;
		this.col = col;
		this.row = row;
		this.pos = pos;
		this.bgPos = bgPos;
		this.zIndex = zIndex;
		this.edges = edges;
		this.neighbors = neighbors;
	}
}