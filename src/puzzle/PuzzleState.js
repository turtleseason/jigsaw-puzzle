// Used for saving and loading puzzles.

export default class PuzzleState {
    // pieces: PieceModel[]
    constructor(pieces, rows, cols, imageWidth, imageHeight, imageInfo) {
        this.pieces = pieces;
        this.rows = rows;
        this.cols = cols;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.imageInfo = imageInfo;
    }
}