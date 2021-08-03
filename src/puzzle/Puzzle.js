// Handles the main puzzle logic.

import { Component } from 'react';
import EdgeStyleInfo from './EdgeStyleInfo';
import GroupModel from './GroupModel';
import PieceModel from './PieceModel';
import PuzzleBoard from './PuzzleBoard';

import { getRandomEdgeType } from './Edges';
import { FLAT } from './Edges';
import { LEFT, TOP, RIGHT, BOTTOM, Sides } from './Sides';
import { range, randomInt } from '../util';

import './Puzzle.css';

const MAX_WIDTH_SCALE = .7;   // The maximum percentage of the window width that the puzzle image should take up. 
const MAX_HEIGHT_SCALE = .7;  // The maximum percentage of the window height that the puzzle image should take up. 

export default class Puzzle extends Component {
    innerWidth = this.props.imgWidth / this.props.cols;
    innerHeight = this.props.imgHeight / this.props.rows;
    borderSize = Math.min(this.innerHeight, this.innerWidth) / 4;
    pieceWidth = 2 * this.borderSize + this.innerWidth;
    pieceHeight = 2 * this.borderSize + this.innerHeight;

    groups;
    nextzIndex = 1;

    topLeftKey;

    state = {
        scaleFactor: undefined,
        offsetX: undefined,
        offsetY: undefined,
        pieces: undefined,
        draggedPiece: null,
        gameComplete: false,
        endAnimationComplete: false,
    };

    constructor(props) {
        super(props);
        this.pointerDownHandlers = range(this.props.rows * this.props.cols).map(i => this.handlePointerDown.bind(this, i));
    }

    componentDidMount() {
        const scaleFactor = this.setScaleFactor();
        window.addEventListener('resize', this.handleResize);

        const pieces = this.createPieces(scaleFactor);
        this.groups = this.createGroups(pieces);
        this.setState({ pieces });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    setScaleFactor() {
        const widthScale = MAX_WIDTH_SCALE * document.documentElement.clientWidth / this.props.imgWidth;
        const heightScale = MAX_HEIGHT_SCALE * document.documentElement.clientHeight / this.props.imgHeight;
        const scaleFactor = Math.min(widthScale, heightScale);
        this.setState({ scaleFactor });
        return scaleFactor;
    }

    getBoardDimensions() {
        // Return a dummy value if board not found? Or just let it throw an error?
        const board = document.querySelector('.puzzle-background');
        return { width: board.clientWidth, height: board.clientHeight };
    }

    clampPiecesToBoardBounds(scaleFactor) {
        const dimensions = this.getBoardDimensions();
        const maxBoundX = dimensions.width / scaleFactor - this.pieceWidth;
        const maxBoundY = dimensions.height / scaleFactor - this.pieceHeight;

        const pieces = this.state.pieces.slice();
        for (const [i, piece] of pieces.entries()) {
            const group = this.groups.get(piece.group);
            const xBound = maxBoundX - (this.innerWidth * (group.bounds[RIGHT] - piece.col));
            const yBound = maxBoundY - (this.innerHeight * (group.bounds[BOTTOM] - piece.row));

            pieces[i] = piece.clone();
            pieces[i].setDisplayPos({
                left: piece.pos.left > xBound ? xBound : piece.pos.left,
                top: piece.pos.top > yBound ? yBound : piece.pos.top
            });
        }
        this.setState({ pieces });
    }

    getGridPosition(col, row, spacing) {
        const left = (this.innerWidth + spacing) * col - this.borderSize;
        const top = (this.innerHeight + spacing) * row - this.borderSize;
        return { left, top };
    }

    getRandomPosition(scaleFactor) {
        const dimensions = this.getBoardDimensions();

        return dimensions.width > dimensions.height ? {
            left: Math.random() * (.15 * dimensions.width / scaleFactor),
            top: Math.random() * (dimensions.height / scaleFactor - this.pieceHeight),
        } : {
            left: Math.random() * (dimensions.width / scaleFactor - this.pieceWidth),
            top: Math.random() * (.15 * dimensions.height) / scaleFactor,
        };
    }

    // Gets the offset position (relative to the top left corner of the full puzzle image) for a piece at this row/column.
    getPieceImageOffset(col, row) {
        const left = -(this.innerWidth * col) + this.borderSize;
        const top = -(this.innerHeight * row) + this.borderSize;
        return { left, top };
    }

    createEdge(type) {
        const neckWidth = this.borderSize * (.8 + Math.random() * .45);
        const offset = this.borderSize * (.4 + Math.random() * .1);
        const c1 = (neckWidth > this.borderSize) ? neckWidth * (.75 + Math.random() * .25)
            : this.borderSize * (.85 + Math.random() * .35);
        const c2 = neckWidth * (.5 + Math.random() * .15);
        return new EdgeStyleInfo(type, neckWidth, offset, c1, c2);
    }

    createPieces(scaleFactor) {
        const pieces = [];
        const availableKeys = range(this.props.cols * this.props.rows);
        // Use map() instead of fill() to ensure that each inner array is a unique object.
        const keysByGridPos = Array(this.props.cols).fill(null).map(() => Array(this.props.rows));

        for (let col = 0; col < this.props.cols; col++) {
            for (let row = 0; row < this.props.rows; row++) {
                const key = availableKeys.splice(randomInt(availableKeys.length), 1)[0];
                keysByGridPos[col][row] = key;

                // const pos = this.getGridPosition(col, row, 0);  // Arranges pieces in a grid instead of scattered randomly (for testing)
                const pos = this.getRandomPosition(scaleFactor);
                const imageOffset = this.getPieceImageOffset(col, row);

                const neighbors = {};
                if (col > 0) {
                    neighbors[LEFT] = keysByGridPos[col - 1][row];
                    pieces[neighbors[LEFT]].neighbors[RIGHT] = key;
                }
                if (row > 0) {
                    neighbors[TOP] = keysByGridPos[col][row - 1];
                    pieces[neighbors[TOP]].neighbors[BOTTOM] = key;
                }

                const edges = {
                    [LEFT]: (col === 0) ? this.createEdge(FLAT) : pieces[neighbors[LEFT]].edges[RIGHT].opposite(),
                    [TOP]: (row === 0) ? this.createEdge(FLAT) : pieces[neighbors[TOP]].edges[BOTTOM].opposite(),
                    [RIGHT]: (col === this.props.cols - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType()),
                    [BOTTOM]: (row === this.props.rows - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType()),
                };

                pieces[key] = new PieceModel(key, col, row, pos, imageOffset, 0, edges, neighbors);
            }
        }
        this.topLeftKey = keysByGridPos[0][0];
        return pieces;
    }

    createGroups(pieces) {
        const groups = new Map();
        pieces.forEach(piece => groups.set(piece.key, new GroupModel(piece)));
        return groups;
    }

    alignPiece(piece, alignWith) {
        piece.setPos({
            left: alignWith.displayPos.left + this.innerWidth * (piece.col - alignWith.col),
            top: alignWith.displayPos.top + this.innerHeight * (piece.row - alignWith.row)
        });
    }

    isTouching(piece, side, other) {
        const snapRange = 7 / this.state.scaleFactor;
        if (side === RIGHT) {
            return Math.abs(piece.displayPos.top - other.displayPos.top) <= snapRange
                && Math.abs((other.displayPos.left - piece.displayPos.left) - this.innerWidth) <= snapRange;
        } else if (side === LEFT) {
            return Math.abs(piece.displayPos.top - other.displayPos.top) <= snapRange
                && Math.abs((piece.displayPos.left - other.displayPos.left) - this.innerWidth) <= snapRange;
        } else if (side === TOP) {
            return Math.abs(piece.displayPos.left - other.displayPos.left) <= snapRange
                && Math.abs((piece.displayPos.top - other.displayPos.top) - this.innerHeight) <= snapRange;
        } else if (side === BOTTOM) {
            return Math.abs(piece.displayPos.left - other.displayPos.left) <= snapRange
                && Math.abs((other.displayPos.top - piece.displayPos.top) - this.innerHeight) <= snapRange;
        }
    }

    mergeGroups(pieces, g1, g2) {
        // First, update all the PieceModels in the group we're about to merge
        const refPiece = pieces[this.groups.get(g1).pieces[0]];
        for (const key of this.groups.get(g2).pieces) {
            const p = pieces[key].clone();
            p.group = g1;
            p.zIndex = refPiece.zIndex;
            this.alignPiece(p, refPiece);
            pieces[key] = p;
        }

        // Then, merge the GroupModels
        this.groups.get(g1).mergeWith(this.groups.get(g2));

        this.groups.delete(g2);
    }

    handlePointerDown = (key, e) => {
        if (this.state.draggedPiece !== null || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) {
            return;
        }

        const pieces = this.state.pieces.slice();
        const groupKey = pieces[key].group;
        for (const k of this.groups.get(groupKey).pieces) {
            pieces[k] = pieces[k].clone();
            pieces[k].zIndex = this.nextzIndex;
            pieces[k].setPos(pieces[k].displayPos);
        }

        this.nextzIndex++;

        this.setState({
            pieces,
            draggedPiece: key,
            offsetX: e.clientX - (pieces[key].pos.left * this.state.scaleFactor),
            offsetY: e.clientY - (pieces[key].pos.top * this.state.scaleFactor)
        });

    };

    handlePointerMove = (e) => {
        if (this.state.draggedPiece === null || !e.isPrimary) {
            return;
        }

        // Ignore events from touches that started within puzzle area but moved out of bounds
        const hitElement = document.elementFromPoint(e.clientX, e.clientY);
        if (!hitElement || !hitElement.classList.contains('puzzle-area')) {
            return;
        }

        const pieces = this.state.pieces.slice();

        const draggedPiece = pieces[this.state.draggedPiece].clone();
        pieces[this.state.draggedPiece] = draggedPiece;

        const left = (e.clientX - this.state.offsetX) / this.state.scaleFactor;
        const top = (e.clientY - this.state.offsetY) / this.state.scaleFactor;
        draggedPiece.setPos({ left, top });

        const group = this.groups.get(draggedPiece.group);
        for (const key of group.pieces) {
            if (key !== this.state.draggedPiece) {
                pieces[key] = pieces[key].clone();
                this.alignPiece(pieces[key], draggedPiece);
            }
        }
        this.setState({ pieces });
    };

    handlePointerUp = () => {
        if (this.state.draggedPiece === null) {
            return;
        }

        const pieces = this.state.pieces.slice();

        const groupKey = pieces[this.state.draggedPiece].group;
        for (const key of this.groups.get(groupKey).pieces) {
            const p = pieces[key];
            for (const side of Sides) {
                const neighbor = pieces[p.neighbors[side]];
                if (neighbor && neighbor.group !== p.group && this.isTouching(p, side, neighbor)) {
                    this.mergeGroups(pieces, p.group, neighbor.group);
                }
            }
        }

        const gameComplete = this.groups.size === 1;
        this.setState({ pieces, gameComplete, draggedPiece: null });
    };

    handleResize = () => {
        const scaleFactor = this.setScaleFactor();
        this.clampPiecesToBoardBounds(scaleFactor);
    };

    render() {
        return (
            <PuzzleBoard
                imgUrl={this.props.imgUrl}
                imgWidth={this.props.imgWidth}
                imgHeight={this.props.imgHeight}
                pieceWidth={this.pieceWidth}
                pieceHeight={this.pieceHeight}
                borderSize={this.borderSize}
                topLeftKey={this.topLeftKey}
                scaleFactor={this.state.scaleFactor}
                gameComplete={this.state.gameComplete}
                pieces={this.state.pieces}
                draggedPiece={this.state.draggedPiece}
                getBoardDimensions={this.getBoardDimensions}
                onPointerMove={this.handlePointerMove}
                onPointerUp={this.handlePointerUp}
                pointerDownHandlers={this.pointerDownHandlers} />
        );
    }
}