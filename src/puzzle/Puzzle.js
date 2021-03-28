import { Component } from 'react';
import ClipPathContainer from './ClipPathContainer';
import EdgePathDrawer from './EdgePathDrawer';
import EdgeStyleInfo from './EdgeStyleInfo';
import GroupModel from './GroupModel';
import Piece from './Piece';
import PieceModel from './PieceModel';
import PuzzleCompleteImage from './PuzzleCompleteImage';

import { getRandomEdgeType } from './Edges';
import { BUMP, RECESS, FLAT } from './Edges';
import { LEFT, TOP, RIGHT, BOTTOM, Sides } from './Sides';
import { range, randomInt } from '../util';

import './Puzzle.css';


const MAX_WIDTH_SCALE = .7;   // The maximum percentage of the window width that the puzzle image should take up. 
const MAX_HEIGHT_SCALE = .7;  // The maximum percentage of the window height that the puzzle image should take up. 

export default class Puzzle extends Component {
    constructor(props) {
        super(props);

        this.innerWidth =  this.props.imgWidth / this.props.cols;
        this.innerHeight = this.props.imgHeight / this.props.rows;
        this.borderSize = Math.min(this.innerHeight, this.innerWidth) / 4;
        this.pieceWidth = 2 * this.borderSize + this.innerWidth;
        this.pieceHeight = 2 * this.borderSize + this.innerHeight;

        this.pointerDownHandlers = range(this.props.rows * this.props.cols).map(i => this.handlePointerDown.bind(this, i));
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);

        this.edgeDrawer = new EdgePathDrawer(this.pieceWidth, this.pieceHeight, this.borderSize);
        this.nextzIndex = 1;

        this.state = {
            gameComplete: false,
            draggedPiece: null,
        }
    }

    componentDidMount() {
        const scaleFactor = this.setScaleFactor();
        window.addEventListener('resize', this.handleResize);

        const pieces = this.createPieces(scaleFactor);
        this.groups = this.createGroups(pieces);
        this.setState({pieces: pieces});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    setScaleFactor() {
        const widthScale = MAX_WIDTH_SCALE * document.documentElement.clientWidth / this.props.imgWidth;
        const heightScale = MAX_HEIGHT_SCALE * document.documentElement.clientHeight / this.props.imgHeight;
        const scaleFactor = Math.min(widthScale, heightScale);
        this.setState({scaleFactor: scaleFactor});
        return scaleFactor;
    }
    
    getBoardDimensions() {
        // Return a dummy value if board not found? Or just let it throw an error?
        const board = document.querySelector('.puzzle-background');
        return {width: board.clientWidth, height: board.clientHeight};
    }

    clampPiecesToBoardBounds(scaleFactor) {
        const dim = this.getBoardDimensions();
        const maxBoundX = dim.width / scaleFactor - this.pieceWidth;
        const maxBoundY = dim.height / scaleFactor - this.pieceHeight;

        const pieces = this.state.pieces.slice();
        for (const [i, piece] of pieces.entries()) {
            const group = this.groups[piece.group];
            const xBound = maxBoundX - (this.innerWidth * (group.bounds[RIGHT] - piece.col));
            const yBound = maxBoundY - (this.innerHeight * (group.bounds[BOTTOM] - piece.row));

            pieces[i] = piece.clone();
            pieces[i].setDisplayPos(
                piece.pos.left > xBound ? xBound : piece.pos.left,
                piece.pos.top > yBound ? yBound : piece.pos.top);
        }
        this.setState({pieces: pieces});
    }

    getGridPosition(col, row, spacing) {
        const left = (this.innerWidth + spacing) * col - this.borderSize;
        const top = (this.innerHeight + spacing) * row - this.borderSize;
        return {left: left, top: top};
    }
    
    getRandomPosition(scaleFactor) {
        const dim = this.getBoardDimensions();

        let left, top;
        if (dim.width > dim.height) {
            left = Math.random() * (.15 * dim.width / scaleFactor);
            top = Math.random() * (dim.height / scaleFactor - this.pieceHeight) ;
        } else {
            left = Math.random() * (dim.width / scaleFactor - this.pieceWidth);
            top = Math.random() * (.15 * dim.height) / scaleFactor;
        }
        return {left: left, top: top};
    }
    
    getBackgroundPosition(col, row) {
        const left = - (this.innerWidth * col) + this.borderSize;
        const top = -(this.innerHeight * row) + this.borderSize;
        return {left: left, top: top};
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
                const keyIndex = randomInt(availableKeys.length);
                const key = availableKeys.splice(keyIndex, 1)[0];
                keysByGridPos[col][row] = key;
                
                // const pos = this.getGridPosition(col, row, 0);
                const pos = this.getRandomPosition(scaleFactor);
                const bgPos = this.getBackgroundPosition(col, row);

                const neighbors = {};
                if (col > 0) {
                    neighbors[LEFT] = keysByGridPos[col - 1][row];
                    pieces[neighbors[LEFT]].neighbors[RIGHT] = key;
                }
                if (row > 0) {
                    neighbors[TOP] = keysByGridPos[col][row - 1];
                    pieces[neighbors[TOP]].neighbors[BOTTOM] = key;
                }

                const edges = {};
                edges[LEFT] = (col === 0) ? this.createEdge(FLAT) : pieces[neighbors[LEFT]].edges[RIGHT].opposite();
                edges[TOP] = (row === 0) ? this.createEdge(FLAT) : pieces[neighbors[TOP]].edges[BOTTOM].opposite();
                edges[RIGHT] = (col === this.props.cols - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType());
                edges[BOTTOM] = (row === this.props.rows - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType());
                
                pieces[key] = new PieceModel(key, col, row, pos, bgPos, 0, edges, neighbors);
            }
        }
        this.topLeftKey = keysByGridPos[0][0];
        return pieces;
    }

    createGroups(pieces) {
        const groups = {};
        for (const piece of pieces) {
            const g = new GroupModel(piece.key);
            g.addPiece(piece.key, piece.row, piece.col);
            groups[piece.key] = g;
        }
        return groups;
    }

    alignPiece(piece, alignWith) {
        piece.setPos(alignWith.displayPos.left + this.innerWidth * (piece.col - alignWith.col),
                     alignWith.displayPos.top + this.innerHeight * (piece.row - alignWith.row));
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
        // First, update all the PieceModels in the group to be merged
        const refPiece = pieces[this.groups[g1].pieces[0]];
        for (const k of this.groups[g2].pieces) {
            const p = pieces[k].clone();
            p.group = g1;
            p.zIndex = refPiece.zIndex;
            this.alignPiece(p, refPiece);
            pieces[k] = p;
        }

        // Then, merge the GroupModels
        this.groups[g1].mergeWith(this.groups[g2]);

        delete this.groups[g2];
    }

    handlePointerDown(key, e) {
        if (this.state.draggedPiece !== null || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) {
            return;
        }

        const pieces = this.state.pieces.slice();
        const groupKey = pieces[key].group;
        for (const k of this.groups[groupKey].pieces) {
            pieces[k] = pieces[k].clone();
            pieces[k].zIndex = this.nextzIndex;
            pieces[k].setPos(pieces[k].displayPos.left, pieces[k].displayPos.top);
        }
        this.nextzIndex++;

        this.setState({
            pieces: pieces,
            draggedPiece: key,
            offsetX: e.clientX - (pieces[key].pos.left * this.state.scaleFactor),
            offsetY: e.clientY - (pieces[key].pos.top * this.state.scaleFactor)
        });

    }

    handlePointerMove(e) {
        if (this.state.draggedPiece === null || !e.isPrimary) {
            return;
        }
        
        // Ignore events from touches that started within puzzle area but moved out of bounds
        const hitElement = document.elementFromPoint(e.clientX, e.clientY);
        if (!hitElement || !hitElement.classList.contains('puzzle-area')) {
            return;
        }

        const key = this.state.draggedPiece;
        const pieces = this.state.pieces.slice();
        
        const p = pieces[key].clone();
        pieces[key] = p;
        
        const left = (e.clientX - this.state.offsetX) / this.state.scaleFactor;
        const top = (e.clientY - this.state.offsetY) / this.state.scaleFactor;
        p.setPos(left, top);

        const group = this.groups[p.group];
        for (const k of group.pieces) {
            pieces[k] = pieces[k].clone();
            this.alignPiece(pieces[k], p);
        }
        this.setState({pieces: pieces});
    }

    handlePointerUp() {
        if (this.state.draggedPiece === null) {
            return;
        }

        const key = this.state.draggedPiece;
        const pieces = this.state.pieces.slice();

        const groupKey = pieces[key].group;
        for (const k of this.groups[groupKey].pieces) {
            const p = pieces[k];
            for (const side of Sides) {
                const neighbor = pieces[p.neighbors[side]];
                if (neighbor && neighbor.group !== p.group && this.isTouching(p, side, neighbor)) {
                    this.mergeGroups(pieces, p.group, neighbor.group);
                }
            }
        }

        const gameComplete = Object.keys(this.groups).length === 1;
        this.setState({pieces: pieces, draggedPiece: null, gameComplete: gameComplete});
    }

    handleResize() {
        const scaleFactor = this.setScaleFactor();
        this.clampPiecesToBoardBounds(scaleFactor);
    }

    handleTransitionEnd() {
        this.setState({endAnimationComplete: true});
    }

    getTopLeftPos() {
        const pos = this.state.pieces[this.topLeftKey].displayPos;
        return {left: pos.left + this.borderSize, top: pos.top + this.borderSize};
    }

    getCenteredImagePos() {
        const dim = this.getBoardDimensions();
        const destLeft = (dim.width / this.state.scaleFactor - this.props.imgWidth) / 2;
        const destTop = (dim.height / this.state.scaleFactor - this.props.imgHeight) / 2;
        return {left: destLeft, top: destTop};
    }

    renderPiece(model) {
        return (
            <Piece key={model.key}
                   model={model}
                   width={this.pieceWidth}
                   height={this.pieceHeight}
                   imgUrl={this.props.imgUrl}
                   blockPointerEvents={this.state.draggedPiece !== null}
                   onPointerDown={this.pointerDownHandlers[model.key]}/>
        );
    }

    render() {
        const boardStyle = {
            transform: `scale(${this.state.scaleFactor})`,
            width: (100 / this.state.scaleFactor) + '%',
            height: (100 / this.state.scaleFactor) + '%'
        };

        let board;
        if (this.state.gameComplete && this.state.endAnimationComplete) {
            board = (<div className='puzzle-area puzzle-complete' style={boardStyle}></div>);
        } else if (this.state.gameComplete) {
            board = (
                <div className='puzzle-area' style={boardStyle}>
                    <PuzzleCompleteImage imgUrl={this.props.imgUrl}
                                         startPos={this.getTopLeftPos()}
                                         destPos={this.getCenteredImagePos()}
                                         width={this.props.imgWidth}
                                         height={this.props.imgHeight}
                                         onTransitionEnd={this.handleTransitionEnd}/>
                </div>);
        } else {
            const children = this.state.pieces ? this.state.pieces.map(model => this.renderPiece(model)) : null;
            board = (
                <div className={'puzzle-area' + (this.state.draggedPiece !== null ? ' no-scroll' : '')}
                     onPointerMove={this.handlePointerMove}
                     onPointerUp={this.handlePointerUp}
                     style={boardStyle}>
                    <ClipPathContainer edgeDrawer={this.edgeDrawer} pieces={this.state.pieces}/>
                    {children}
                </div>);
        }
        
        return (
            <div className='puzzle-container mt-2'>
                <div className='puzzle-background'></div>
                {board}
                {/* Use a separate div for padding because adding padding directly to the puzzle container
                    can cause the game-completed image to jump at the end of its motion */}
                <div className='pb-3'></div>
            </div>
        );
    }
}