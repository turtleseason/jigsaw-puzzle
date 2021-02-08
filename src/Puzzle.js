import React from 'react';
import EdgePathDrawer from './EdgePathDrawer.js';
import EdgeStyleInfo from './EdgeStyleInfo.js';
import Piece from './Piece.js';

import { getRandomEdgeType, getOppositeEdge } from './Edges.js';
import { BUMP, RECESS, FLAT } from './Edges.js';
import { LEFT, TOP, RIGHT, BOTTOM } from './Sides.js';
import { range, randomInt } from './util.js';


const e = React.createElement;

class PieceModel {
	// By default, a piece is inserted into the group with the same id as its key
	constructor(key, col, row, left, top, zIndex, edges, neighbors) {
		this.key = key;
		this.group = key;
		this.col = col;
		this.row = row;
		this.left = left;
		this.zIndex = zIndex;
		this.top = top;
		this.edges = edges;
		this.neighbors = neighbors;
	}

	static clone(obj) {
		const copy = {...obj};
		copy.edges = {...obj.edges};
		copy.neighbors = {...obj.neighbors};
		return copy;
	}
}

class Puzzle extends React.Component {
	constructor(props) {
		super(props);

		const edgeDrawer = new EdgePathDrawer(this.pieceWidth, this.pieceHeight, this.props.borderSize);
		const pieces = this.createPieces();
		let groups = {};
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

	get boxWidth() {
		return this.props.imgWidth / this.props.cols;	
	}

	get boxHeight() {
		return this.props.imgHeight / this.props.rows;
	}

	get pieceWidth() {
		return 2 * this.props.borderSize + this.boxWidth;
	}

	get pieceHeight() {
		return 2 * this.props.borderSize + this.boxHeight;
	}

	createEdge(type) {
		return new EdgeStyleInfo(type, this.props.borderSize, this.props.borderSize / 3, this.props.borderSize, this.props.borderSize / 2);
	}

	createPieces() {
		const pieces = [];
		const availableKeys = range(this.props.cols * this.props.rows);
		// Use map() instead of fill() to ensure that each inner array is a unique object.
		const keysByGridPos = Array(this.props.cols).fill(null).map(() => Array(this.props.rows));
		for (let i = 0; i < this.props.cols; i++) {
			for (let j = 0; j < this.props.rows; j++) {
				const keyIndex = randomInt(availableKeys.length);
				const key = availableKeys.splice(keyIndex, 1)[0];
				keysByGridPos[i][j] = key;
				
				const leftPos = (this.boxWidth + 2) * i - this.props.borderSize;  // (temp)
				const topPos = (this.boxHeight + 2) * j - this.props.borderSize;  // (temp)

				const neighbors = {};
				if (i > 0) {
					neighbors[LEFT] = keysByGridPos[i - 1][j];
					pieces[neighbors[LEFT]].neighbors[RIGHT] = key;
				}
				if (j > 0) {
					neighbors[TOP] = keysByGridPos[i][j - 1];
					pieces[neighbors[TOP]].neighbors[BOTTOM] = key;
				}
				
				const edges = {};
				edges[LEFT] = (i === 0) ? this.createEdge(FLAT) : pieces[neighbors[LEFT]].edges[RIGHT].opposite();
				edges[TOP] = (j === 0) ? this.createEdge(FLAT) : pieces[neighbors[TOP]].edges[BOTTOM].opposite();
				edges[RIGHT] = (i === this.props.cols - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType());
				edges[BOTTOM] = (j === this.props.rows - 1) ? this.createEdge(FLAT) : this.createEdge(getRandomEdgeType());
				
				pieces[key] = new PieceModel(key, i, j, leftPos, topPos, 0, edges, neighbors);
			}
		}
		return pieces;
	}

	handleMouseDown(e, key) {
		if (e.button !== 0 || this.state.draggedPiece !== null) {
			return;
		}

		const pieces = this.state.pieces.map(x => PieceModel.clone(x));  // use lodash for deep copy?
		pieces[key].zIndex = this.state.nextzIndex;
		
		this.setState({
			pieces: pieces,
			draggedPiece: key,
			nextzIndex: this.state.nextzIndex + 1,
			offsetX: e.clientX - this.state.pieces[key].left,
			offsetY: e.clientY - this.state.pieces[key].top
		});
	}

	handleMouseMove(e) {
		if (this.state.draggedPiece !== null) {
			const key = this.state.draggedPiece;
			const pieces = this.state.pieces.map(x => PieceModel.clone(x));
			
			const p = pieces[key];
			p.left = e.clientX - this.state.offsetX;
			p.top = e.clientY - this.state.offsetY;

			for (const k of this.state.groups[p.group]) {
				this.snapToPosition(pieces[k], p);
			}
			this.setState({pieces: pieces});
		}
	}

	snapToPosition(piece, snapTo) {
		piece.left = snapTo.left + this.boxWidth * (piece.col - snapTo.col);
		piece.top = snapTo.top + this.boxHeight * (piece.row - snapTo.row);
	}

	isTouching(piece, side, other) {
		const snapRange = 3;
		if (side === RIGHT) {
			return Math.abs(piece.top - other.top) <= snapRange
				&& Math.abs((other.left - piece.left) - this.boxWidth) <= snapRange;
		} else if (side === LEFT) {
			return Math.abs(piece.top - other.top) <= snapRange
				&& Math.abs((piece.left - other.left) - this.boxWidth) <= snapRange;
		} else if (side === TOP) {
			return Math.abs(piece.left - other.left) <= snapRange
				&& Math.abs((piece.top - other.top) - this.boxHeight) <= snapRange;
		} else if (side === BOTTOM) {
			return Math.abs(piece.left - other.left) <= snapRange
				&& Math.abs((other.top - piece.top) - this.boxHeight) <= snapRange;
		}
	}

	mergeGroups(pieces, groups, g1, g2) {
		groups[g1] = groups[g1].concat(groups[g2]);
		const refPiece = pieces[groups[g1][0]];
		for (const k of groups[g2]) {
			pieces[k].group = g1;
			this.snapToPosition(pieces[k], refPiece);
		}
		delete groups[g2];
	}

	handleMouseUp(e, key) {
		if (this.state.draggedPiece !== key) {
			return;
		}

		const groups = {...this.state.groups};  // deep copy?
		const pieces = this.state.pieces.map(x => PieceModel.clone(x));

		for (const k of this.state.groups[pieces[key].group]) {
			const p = pieces[k];
			for (const side of [LEFT, TOP, RIGHT, BOTTOM]) {
				const neighbor = pieces[p.neighbors[side]];
				if (neighbor && neighbor.group !== p.group && this.isTouching(p, side, neighbor)) {
					this.mergeGroups(pieces, groups, p.group, neighbor.group);
					
					console.log("grouped " + k + " & " + neighbor.key)						
					let str = ''; for (const i in groups) { str += "[" + groups[i] + "] "; }
					console.log(str);
				}
			}
		}

		const gameComplete = Object.keys(groups).length === 1;
		this.setState({groups: groups, pieces: pieces, draggedPiece: null, gameComplete: gameComplete});
	}

	renderPiece(model, isDragged) {
		const bgLeft = - (this.boxWidth * model.col) + this.props.borderSize;
		const bgTop = -(this.boxHeight * model.row) + this.props.borderSize;

		let clipPathString = '';
		for (const side of [LEFT, TOP, RIGHT, BOTTOM]) {
			const edge = model.edges[side];
			clipPathString += this.state.edgeDrawer.getPathString(side, model.edges[side]);
		}

		return e(Piece, {
			key: model.key,
			keystr: model.key + '',
			col: model.col,
			row: model.row,
			width: this.pieceWidth,
			height: this.pieceHeight,
			left: model.left,
			top: model.top,
			bgLeft: bgLeft,
			bgTop: bgTop,
			zIndex: model.zIndex || 'auto',
			edges: model.edges,
			neighbors: model.neighbors,
			onMouseDown: (e) => this.handleMouseDown(e, model.key),
			onMouseUp: (e) => this.handleMouseUp(e, model.key),
			clipPathString: clipPathString
		});
	}

	render() {
		if (this.state.gameComplete) {
			return e('div', {className: 'puzzle_complete'});
		} else {
			const renderedPieces = this.state.pieces.map(
				model => this.renderPiece(model, model.key === this.state.draggedPiece));
			return e('div', 
				{onMouseMove: (e) => this.handleMouseMove(e)},
				[this.state.masks].concat(renderedPieces));
		}
	}
}

export default Puzzle;