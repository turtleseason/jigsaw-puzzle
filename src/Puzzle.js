import React from 'react';
import EdgePathDrawer from './EdgePathDrawer.js';
import EdgeStyleInfo from './EdgeStyleInfo.js';
import Piece from './Piece.js';
import PieceModel from './PieceModel.js';

import { getRandomEdgeType, getOppositeEdge } from './Edges.js';
import { BUMP, RECESS, FLAT } from './Edges.js';
import { LEFT, TOP, RIGHT, BOTTOM, Sides } from './Sides.js';
import { range, randomInt } from './util.js';


const MAX_WIDTH_SCALE = .7;  // The maximum percentage of the window width that the puzzle image should take up. 
const MAX_HEIGHT_SCALE = .9;  // The maximum percentage of the window height that the puzzle image should take up. 

class Puzzle extends React.Component {
	constructor(props) {
		super(props);

		this.innerWidth =  this.props.imgWidth / this.props.cols;	
		this.innerHeight = this.props.imgHeight / this.props.rows;
		this.borderSize = Math.min(this.innerHeight, this.innerWidth) / 4;
		this.pieceWidth = 2 * this.borderSize + this.innerWidth;
		this.pieceHeight = 2 * this.borderSize + this.innerHeight;

		const edgeDrawer = new EdgePathDrawer(this.pieceWidth, this.pieceHeight, this.borderSize);
		const pieces = this.createPieces();
		const groups = {};
		for (let i = 0; i < pieces.length; i++) {
			groups[i] = [i];
		}

		this.state = {
			pieces: pieces,
			groups: groups,
			edgeDrawer: edgeDrawer,
			gameComplete: false,
			draggedPiece: null,
			nextzIndex: 1
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
		return new EdgeStyleInfo(type, this.borderSize, this.borderSize / 3, this.borderSize, this.borderSize / 2);
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
		return pieces;
	}

	alignPiece(piece, alignWith) {
		piece.pos = {left: alignWith.pos.left + this.innerWidth * (piece.col - alignWith.col),
					 top: alignWith.pos.top + this.innerHeight * (piece.row - alignWith.row)};
	}
	
	isTouching(piece, side, other) {
		const snapRange = 7;
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
			pieces[k].group = g1;
			pieces[k].zIndex = refPiece.zIndex;
			this.alignPiece(pieces[k], refPiece);
		}
		delete groups[g2];
	}

	handleMouseDown(e, key) {
		if (e.button !== 0 || this.state.draggedPiece !== null) {
			return;
		}

		const pieces = this.state.pieces.map(x => PieceModel.clone(x));
		for (const k of this.state.groups[pieces[key].group]) {
			pieces[k].zIndex = this.state.nextzIndex;
		}
		
		this.setState({
			pieces: pieces,
			draggedPiece: key,
			nextzIndex: this.state.nextzIndex + 1,
			offsetX: e.clientX - (this.state.pieces[key].pos.left * this.state.scaleFactor),
			offsetY: e.clientY - (this.state.pieces[key].pos.top * this.state.scaleFactor)
		});
	}

	handleMouseMove(e) {
		if (this.state.draggedPiece === null) {
			return;
		}

		const key = this.state.draggedPiece;
		const pieces = this.state.pieces.map(x => PieceModel.clone(x));
		
		const p = pieces[key];
		const left = (e.clientX - this.state.offsetX) / this.state.scaleFactor;
		const top = (e.clientY - this.state.offsetY) / this.state.scaleFactor;
		p.pos = {left: left, top: top };

		for (const k of this.state.groups[p.group]) {
			this.alignPiece(pieces[k], p);
		}
		this.setState({pieces: pieces});
	}

	handleMouseUp() {
		if (this.state.draggedPiece === null) {
			return;
		}

		const key = this.state.draggedPiece;
		const groups = {...this.state.groups};
		const pieces = this.state.pieces.map(x => PieceModel.clone(x));

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

	renderPiece(model) {
		return (
			<Piece key={model.key}
				model={model}
				width={this.pieceWidth}
				height={this.pieceHeight}
				isDragged={model.key === this.state.draggedPiece}
				blockPointerEvents={this.state.draggedPiece !== null}
				edgeDrawer={this.state.edgeDrawer}
				onMouseDown={(e) => this.handleMouseDown(e, model.key)}
				onMouseUp={(e) => this.handleMouseUp(e, model.key)}/>
		);
	}

	render() {
		const boardStyle = {transform: `scale(${this.state.scaleFactor})`, width: (100 / this.state.scaleFactor) + '%', height: (100 / this.state.scaleFactor) + '%'};

		let board;
		if (this.state.gameComplete) {
			board = (<div className='puzzle-area puzzle-complete' style={boardStyle}></div>);
		} else {
			const children = this.state.pieces.map(model => this.renderPiece(model));
			board = (
				<div 
					className='puzzle-area'
					onMouseMove={(e) => this.handleMouseMove(e)}
					onMouseUp={() => this.handleMouseUp()}
					style={boardStyle}>
					{ children }
				</div>);
		}
		
		return (
			<div className='puzzle-container'>
				<div className='puzzle-background'></div>
				{board}
			</div>
		);
	}
}

export default Puzzle;