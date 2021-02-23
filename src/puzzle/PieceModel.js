// Never mutate pos or displayPos's left/top properties; always set them using setPos() or setDisplayPos()
// to ensure that the Piece re-renders properly and that pos and displayPos stay in sync. 

export default class PieceModel {

    // All parameters should be integers except:
    // pos, bgPos: Objects with the properties 'left' and 'top', each set to a number.
    // edges:      An object with the properties LEFT, TOP, RIGHT, and BOTTOM (see Sides.js),
    //             each set to an EdgeStyleInfo object.
    // neighbors:  An object with the properties LEFT, TOP, RIGHT, and BOTTOM (see Sides.js),
    //             each set to the key of another PieceModel or undefined.  
    // 
    constructor(key, col, row, pos, bgPos, zIndex, edges, neighbors) {
        // By default, a new piece is inserted into the group with the same id as its key.
        this.group = key;
        
        this.key = key;
        this.col = col;
        this.row = row;
        this.bgPos = bgPos;
        this.zIndex = zIndex;
        this.edges = edges;
        this.neighbors = neighbors;
        
        this.setPos(pos.left, pos.top);
    }
    
    get pos() {
        return this.actualPos;
    }
    
    set pos(val) {
        throw Error('PieceModel: Don\'t set "pos" directly - use setPos() instead.');
    }
    
    // 'pos' is the piece's original position before clamping; it doesn't change when the board is resized
    // so that if the board is expanded again, the piece can return to its original position.
    setPos(left, top) {
        this.actualPos = {left: left, top: top};
        this.displayPos = this.actualPos;
    }

    // 'displayPos' is the piece's clamped position; if the board is resized so that the piece would end up outside the board,
    // its display position is set to keep it in bounds.
    // When the piece is interacted with (picked up or merged with another piece/group), displayPos becomes the piece's actual position.
    setDisplayPos(left, top) {
        this.displayPos = {left: left, top: top};
    }

    clone() {
        const copy = new PieceModel(this.key, this.col, this.row, this.pos, this.bgPos, this.zIndex, this.edges, this.neighbors);
        copy.group = this.group;
        copy.setDisplayPos(this.displayPos.left, this.displayPos.top);
        return copy;
    }
}