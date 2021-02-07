// To add JSX support:
// https://reactjs.org/docs/add-react-to-a-website.html#optional-try-react-with-jsx

'use strict';
(function() {
	const e = React.createElement;
	
	const LEFT = 'Left';
	const TOP = 'Top';
	const RIGHT = 'Right';
	const BOTTOM = 'Bottom';

	const BUMP = 'b';
	const RECESS = 'r';
	const FLAT = 'f';

	// Returns an array containing values from 0 (inclusive) to i (exclusive).
	function range(i) {
		return Array.from(Array(i).keys());
	}

	// Returns a random integer between 0 (inclusive) and max (exclusive).
	function randomInt(max) {
		return Math.floor(Math.random() * (max - .00001));
	}

	function getRandomEdgeType() {
		// Excludes FLAT since that edge type isn't assigned randomly.
		const types = [BUMP, RECESS];
		return types[randomInt(types.length)];
	}
	
	function getOppositeEdge(edge) {
		switch(edge) {
			case BUMP:
				return RECESS;
			case RECESS:
				return BUMP;
			default:
				throw Error(`getOppositeEdge: ${edge} does not have an opposite edge type`);
		}
	}

	class EdgePathDrawer {
		constructor(pieceWidth, pieceHeight, borderSize) {
			this.START = 'START';
			this.templates = this.makeTemplates(pieceWidth, pieceHeight, borderSize)
		}

		makeTemplates(pW, pH, b) {
			const templates = {};

			templates[this.START] = `M ${b} ${pH - b} `;

			templates[BUMP + LEFT] = (w, o, c1, c2) => `V ${(pH + w) / 2}`	
				+ `C ${b - o} ${pH / 2 + c1} ${0} ${pH / 2 + c2} ${0} ${pH / 2} `
				+ `C ${0} ${pH / 2 - c2} ${b - o} ${pH / 2 - c1} ${b} ${(pH - w) / 2} `;
			templates[RECESS + LEFT] = (w, o, c1, c2) => `V ${(pH + w) / 2}`
				+ `C ${b + o} ${pH / 2 + c1} ${b * 2} ${pH / 2 + c2} ${b * 2} ${pH / 2} `
				+ `C ${b * 2} ${pH / 2 - c2} ${b + o} ${pH / 2 - c1} ${b} ${(pH - w) / 2} `;
			templates[LEFT] = `V ${b} `;

			templates[BUMP + TOP] = (w, o, c1, c2) => `H ${(pW - w) / 2} `
				+ `C ${pW / 2 - c1} ${b - o} ${pW / 2 - c2} ${0} ${pW / 2} ${0} `
				+ `C ${pW / 2 + c2} ${0} ${pW / 2 + c1} ${b - o} ${(pW + w) / 2} ${b} `;
			templates[RECESS + TOP] = (w, o, c1, c2) => `H ${(pW - w) / 2} `
				+ `C ${pW / 2 - c1} ${b + o}  ${pW / 2 - c2} ${b * 2} ${pW / 2} ${b * 2} `
				+ `C ${pW / 2 + c2} ${b * 2} ${pW / 2 + c1} ${b + o} ${(pW + w) / 2} ${b} `;
			templates[TOP] = `H ${pW - b} `;

			templates[BUMP + RIGHT] = (w, o, c1, c2) => `V ${(pH - w) / 2} `
				+ `C ${pW - b + o} ${pH / 2 - c1} ${pW} ${pH / 2 - c2} ${pW} ${pH / 2} `
				+ `C ${pW} ${pH / 2 + c2} ${pW - b + o} ${pH / 2 + c1} ${pW - b} ${(pH + w) / 2} `;
			templates[RECESS + RIGHT] = (w, o, c1, c2) => `V ${(pH - w) / 2} `
				+ `C ${pW - b - o} ${pH / 2 - c1} ${pW - b * 2} ${pH / 2 - c2} ${pW - b * 2} ${pH / 2} `
				+ `C ${pW - b * 2} ${pH / 2 + c2} ${pW - b - o} ${pH / 2 + c1} ${pW - b} ${(pH + w) / 2} `;
			templates[RIGHT] = `V ${pH - b} `;

			templates[BUMP + BOTTOM] = (w, o, c1, c2) => `H ${(pW + w) / 2} `
				+ `C ${pW / 2 + c1} ${pH - b + o} ${pW / 2 + c2} ${pH} ${pW / 2} ${pH} `
				+ `C ${pW / 2 - c2} ${pH} ${pW / 2 - c1} ${pH - b + o} ${(pW - w) / 2} ${pH - b} `;
			templates[RECESS + BOTTOM] = (w, o, c1, c2) => `H ${(pW + w) / 2} `
				+ `C ${pW / 2 + c1} ${pH - b - o}  ${pW / 2 + c2} ${pH - b * 2} ${pW / 2} ${pH - b * 2} `
				+ `C ${pW / 2 - c2} ${pH - b * 2} ${pW / 2 - c1} ${pH - b - o} ${(pW - w) / 2} ${pH - b} `;
			templates[BOTTOM] = `Z`;

			return templates;
		}

		getPathString(side, edgeStyleInfo) {
			const start = (side === LEFT) ? this.templates[this.START] : '';
			const end = this.templates[side];

			let mid = '';
			if (edgeStyleInfo.type !== FLAT) {
				const key = edgeStyleInfo.type + side;
				mid = this.templates[key](edgeStyleInfo.w, edgeStyleInfo.o, edgeStyleInfo.c1, edgeStyleInfo.c2);
			}

			return start + mid + end;
		}
	}

	class EdgeStyleInfo {
		constructor(type, neckWidth, offset, control1, control2) {
			this.type = type;
			this.w = neckWidth;
			this.o = offset;
			this.c1 = control1;
			this.c2 = control2;
		}

		opposite() {
			const other = {...this};
			other.type = getOppositeEdge(this.type);
			return other;
		}
	}

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
	
	class Piece extends React.Component {
		getClipPathString() {
			return 'path(\'' + this.props.clipPathString + '\')';
		}

		render() {
			return e('div', {
				className: 'puzzle_piece',
				idtemp: this.props.keystr,
				onMouseDown: (e) => this.props.onMouseDown(e),
				onMouseUp: (e) => this.props.onMouseUp(e),
				style: {
					backgroundPosition: `${this.props.bgLeft}px ${this.props.bgTop}px`,
					width: this.props.width,
					height: this.props.height,
					left: this.props.left,
					top: this.props.top,
					zIndex: this.props.zIndex,
					clipPath: this.getClipPathString()
				}
			});
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
	
	function renderRoot() {
		const domContainer = document.getElementById('puzzle_container');
		ReactDOM.render(e(Puzzle,{
			imgWidth: 1221,
			imgHeight: 823,
			borderSize: 30,
			offset: 10,
			rows: 7,
			cols: 10 
		}), domContainer);
	}
	
	window.addEventListener('DOMContentLoaded', renderRoot);
}());