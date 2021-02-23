import { Component } from 'react';
import EdgePathDrawer from './EdgePathDrawer';
import EdgeStyleInfo from './EdgeStyleInfo';
import Piece from './Piece';
import PieceModel from './PieceModel';
import PuzzleCompleteImage from './PuzzleCompleteImage';

import { getRandomEdgeType } from './Edges';
import { BUMP, RECESS, FLAT } from './Edges';
import { LEFT, TOP, RIGHT, BOTTOM, Sides } from './Sides';
import { range, randomInt, objectMap } from '../util';

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
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);

        this.edgeDrawer = new EdgePathDrawer(this.pieceWidth, this.pieceHeight, this.borderSize);
        this.nextzIndex = 1;

        const pieces = this.createPieces();
        const groups = objectMap(range(pieces.length), (i) => [i]);

        this.state = {
            pieces: pieces,
            groups: groups,
            gameComplete: false,
            draggedPiece: null,
        }
    }

    componentDidMount() {
        this.setScaleFactor();

        this.resizeListener = this.setScaleFactor.bind(this);
        window.addEventListener('resize', this.resizeListener);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    setScaleFactor() {
        const widthScale = MAX_WIDTH_SCALE * document.documentElement.clientWidth / this.props.imgWidth;
        const heightScale = MAX_HEIGHT_SCALE * document.documentElement.clientHeight / this.props.imgHeight;
        this.setState({scaleFactor: Math.min(widthScale, heightScale)});
    }

    getGridPosition(col, row, spacing) {
        const left = (this.innerWidth + spacing) * col - this.borderSize;
        const top = (this.innerHeight + spacing) * row - this.borderSize;
        return {left: left, top: top};
    }
    
    getRandomPosition() {
        const left = Math.random() * (.2 * this.props.imgWidth);
        const top = Math.random() * (this.props.imgHeight - this.pieceHeight);
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

    createPieces() {
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
                const pos = this.getRandomPosition();
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

    alignPiece(piece, alignWith) {
        piece.pos = {left: alignWith.pos.left + this.innerWidth * (piece.col - alignWith.col),
                     top: alignWith.pos.top + this.innerHeight * (piece.row - alignWith.row)};
    }
    
    isTouching(piece, side, other) {
        const snapRange = 7 / this.state.scaleFactor;
        if (side === RIGHT) {
            return Math.abs(piece.pos.top - other.pos.top) <= snapRange
                && Math.abs((other.pos.left - piece.pos.left) - this.innerWidth) <= snapRange;
        } else if (side === LEFT) {
            return Math.abs(piece.pos.top - other.pos.top) <= snapRange
                && Math.abs((piece.pos.left - other.pos.left) - this.innerWidth) <= snapRange;
        } else if (side === TOP) {
            return Math.abs(piece.pos.left - other.pos.left) <= snapRange
                && Math.abs((piece.pos.top - other.pos.top) - this.innerHeight) <= snapRange;
        } else if (side === BOTTOM) {
            return Math.abs(piece.pos.left - other.pos.left) <= snapRange
                && Math.abs((other.pos.top - piece.pos.top) - this.innerHeight) <= snapRange;
        }
    }

    mergeGroups(pieces, groups, g1, g2) {
        groups[g1] = groups[g1].concat(groups[g2]);
        const refPiece = pieces[groups[g1][0]];
        for (const k of groups[g2]) {
            const p = {...pieces[k]};
            p.group = g1;
            p.zIndex = refPiece.zIndex;
            this.alignPiece(p, refPiece);
            pieces[k] = p;
        }
        delete groups[g2];
    }

    handlePointerDown(key, e) {
        if (this.state.draggedPiece !== null || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) {
            return;
        }

        const pieces = this.state.pieces.slice();
        for (const k of this.state.groups[pieces[key].group]) {
            pieces[k] = {...pieces[k]};
            pieces[k].zIndex = this.nextzIndex;
        }
        this.nextzIndex++;

        this.setState({
            pieces: pieces,
            draggedPiece: key,
            offsetX: e.clientX - (this.state.pieces[key].pos.left * this.state.scaleFactor),
            offsetY: e.clientY - (this.state.pieces[key].pos.top * this.state.scaleFactor)
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
        
        const p = {...pieces[key]};
        pieces[key] = p;
        
        const left = (e.clientX - this.state.offsetX) / this.state.scaleFactor;
        const top = (e.clientY - this.state.offsetY) / this.state.scaleFactor;
        p.pos = {left: left, top: top };

        for (const k of this.state.groups[p.group]) {
            pieces[k] = {...pieces[k]};
            this.alignPiece(pieces[k], p);
        }
        this.setState({pieces: pieces});
    }

    handlePointerUp() {
        if (this.state.draggedPiece === null) {
            return;
        }

        const key = this.state.draggedPiece;
        const groups = {...this.state.groups};
        const pieces = this.state.pieces.slice();

        for (const k of this.state.groups[pieces[key].group]) {
            const p = pieces[k];
            for (const side of Sides) {
                const neighbor = pieces[p.neighbors[side]];
                if (neighbor && neighbor.group !== p.group && this.isTouching(p, side, neighbor)) {
                    this.mergeGroups(pieces, groups, p.group, neighbor.group);
                }
            }
        }

        const gameComplete = Object.keys(groups).length === 1;
        this.setState({groups: groups, pieces: pieces, draggedPiece: null, gameComplete: gameComplete});
    }

    handleTransitionEnd() {
        this.setState({endAnimationComplete: true});
    }

    getTopLeftPos() {
        const pos = this.state.pieces[this.topLeftKey].pos;
        return {left: pos.left + this.borderSize, top: pos.top + this.borderSize};
    }

    getCenteredImagePos() {
        const bg = document.querySelector('.puzzle-background');
        const destLeft = (bg.clientWidth / this.state.scaleFactor - this.props.imgWidth) / 2;
        const destTop = (bg.clientHeight / this.state.scaleFactor - this.props.imgHeight) / 2;
        return {left: destLeft, top: destTop};
    }

    renderPiece(model) {
        return (
            <Piece key={model.key}
                model={model}
                width={this.pieceWidth}
                height={this.pieceHeight}
                // isDragged={model.group === this.state.pieces[this.state.draggedPiece].group}
                blockPointerEvents={this.state.draggedPiece !== null}
                edgeDrawer={this.edgeDrawer}
                onPointerDown={this.pointerDownHandlers[model.key]}/>
        );
    }

    render() {
        const boardStyle = {transform: `scale(${this.state.scaleFactor})`, width: (100 / this.state.scaleFactor) + '%', height: (100 / this.state.scaleFactor) + '%'};

        let board;
        if (this.state.gameComplete && this.state.endAnimationComplete) {
            board = (<div className='puzzle-area puzzle-complete' style={boardStyle}></div>);
        } else if (this.state.gameComplete) {
            board = (
                <div className='puzzle-area' style={boardStyle}>
                    <PuzzleCompleteImage startPos={this.getTopLeftPos()} destPos={this.getCenteredImagePos()}
                    width={this.props.imgWidth} height={this.props.imgHeight} onTransitionEnd={this.handleTransitionEnd}/>
                </div>);
        } else {
            const children = this.state.pieces.map(model => this.renderPiece(model));
            board = (
                <div 
                    className={'puzzle-area' + (this.state.draggedPiece !== null ? ' no-scroll' : '')}
                    onPointerMove={this.handlePointerMove}
                    onPointerUp={this.handlePointerUp}
                    style={boardStyle}>
                    { children }
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