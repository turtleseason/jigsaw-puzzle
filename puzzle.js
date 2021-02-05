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

	class Piece extends React.Component {
		getMaskString() {
			const bumps = [];
			const recesses = [];
			for (const side of [LEFT, TOP, RIGHT, BOTTOM]) {
				if (this.props.edges[side] === BUMP) {
					bumps.push(side);
				} else if (this.props.edges[side] === RECESS) {
					recesses.push(side);
				}
			}

			// (mask-composite only works in Firefox; webkit may have a prefixed version?)
			// -> switch to clipping mask so that mask affects click area
			let maskString = bumps.map(s => `url(#${BUMP}${s}), `).join('');
			maskString += 'url(#main) subtract'; // subtract = "subtract all layers below from this layer," not vice-versa
			maskString += recesses.map(s => `, url(#${RECESS}${s})`).join('');
			return maskString;
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
					mask: this.getMaskString()
				}
			});
		}
	}

	class Puzzle extends React.Component {
		PieceModel = class {
			constructor(key, col, row, left, top, zIndex, edges, neighbors) {
				this.key = key;
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

		constructor(props) {
			super(props);
			
			const masks = this.createMasks();
			const pieces = this.createPieces();

			this.state = {
				masks: masks,
				pieces: pieces,
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

		createSideMask(side, type, borderSize, offset) {
			const name = type + side;
			const radius = borderSize - offset;
			const centerToEdge = (type === BUMP) ? borderSize - offset : borderSize + offset;
			
			let x, y;
			if (side === LEFT || side === RIGHT) {
				x = (side === LEFT) ? centerToEdge : this.pieceWidth - centerToEdge;
				y = this.pieceHeight / 2;
			} else {
				x = this.pieceWidth / 2;
				y = (side === TOP) ? centerToEdge : this.pieceHeight - centerToEdge;
			}
			
			return e('mask', {id: name, key: name}, [
				e('circle', {fill: '#FFFFFF', cx: x, cy: y, r: radius, key: 0})
			]);
		}

		createMasks() {
			const masks = [];

			// Default mask (rectangular middle area)
			masks.push(e('mask', {id: 'main', key: 'main'}, [
				e('rect', {
					fill: '#000000',
					x: 0,
					y: 0,
					width: this.pieceWidth,
					height: this.pieceHeight,
					key: 0
				}),
				e('rect', {
					fill: '#FFFFFF',
					x: this.props.borderSize,
					y: this.props.borderSize,
					width: this.boxWidth,
					height: this.boxHeight,
					key: 1
				})
			]));

			for (let side of [LEFT, TOP, RIGHT, BOTTOM]) {
				for (let type of [BUMP, RECESS]) {
					masks.push(this.createSideMask(side, type, this.props.borderSize, this.props.offset));
				}
			}

			return e('svg', {height: 0, width: 0, key: -1}, masks);
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
					neighbors[LEFT] = (i > 0) ? keysByGridPos[i - 1][j] : undefined;
					neighbors[TOP] = (j > 0) ? keysByGridPos[i][j - 1] : undefined;
					
					const edges = {};
					edges[LEFT] = (i === 0) ? FLAT : getOppositeEdge(pieces[neighbors[LEFT]].edges[RIGHT]);
					edges[TOP] = (j === 0) ? FLAT : getOppositeEdge(pieces[neighbors[TOP]].edges[BOTTOM]);
					edges[RIGHT] = (i === this.props.cols - 1) ? FLAT : getRandomEdgeType();
					edges[BOTTOM] = (j === this.props.rows - 1) ? FLAT : getRandomEdgeType();
					
					pieces[key] = new this.PieceModel(key, i, j, leftPos, topPos, 0, edges, neighbors);
				}
			}
			return pieces;
		}

		handleMouseDown(e, key) {
			if (e.button !== 0 || this.state.draggedPiece !== null) {
				return;
			}
			console.log('Picked up ' + key);

			const pieces = this.state.pieces.map(x => this.PieceModel.clone(x));  // use lodash for deep copy?
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
				const pieces = this.state.pieces.map(x => this.PieceModel.clone(x));
				pieces[key].left = e.clientX - this.state.offsetX;
				pieces[key].top = e.clientY - this.state.offsetY;
				this.setState({pieces: pieces});
			}
		}

		handleMouseUp(e, key) {
			if (this.state.draggedPiece === key) {
				this.setState({draggedPiece: null});
				console.log('Released ' + key);
			}
		}

		renderPiece(model, isDragged) {
			const bgLeft = - (this.boxWidth * model.col) + this.props.borderSize;
			const bgTop = -(this.boxHeight * model.row) + this.props.borderSize;

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
				onMouseUp: (e) => this.handleMouseUp(e, model.key)
			});
		}

		render() {
			const renderedPieces = this.state.pieces.map(
				model => this.renderPiece(model, model.key === this.state.draggedPiece));
			return e('div', 
				{onMouseMove: (e) => this.handleMouseMove(e)},
				[this.state.masks].concat(renderedPieces));
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