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

	class Piece extends React.Component {
		render() {
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
			let maskString = bumps.map(s => `url(#${BUMP}${s}), `).join('');
			maskString += 'url(#main) subtract'; // subtract = "subtract all layers below from this layer," not vice-versa
			maskString += recesses.map(s => `, url(#${RECESS}${s})`).join('');

			return e('div', {
				className: 'puzzle_piece',
				idtemp: this.props.keystr,
				style: {
					backgroundPosition: `${this.props.bgLeft}px ${this.props.bgTop}px`,
					width: this.props.width,
					height: this.props.height,
					left: this.props.left,
					top: this.props.top,
					mask: maskString
				}
			});
		}
	}
	
	class Puzzle extends React.Component {
		constructor(props) {
			super(props);

			const masks = this.createMasks();

			const pieces = this.createPieces();

			this.state = {
				masks: masks,
				pieces: pieces
			}
		}

		createSideMask(side, type, borderSize, offset, pieceHeight, pieceWidth) {
			const name = type + side;
			const radius = borderSize - offset;
			const centerToEdge = (type === BUMP) ? borderSize - offset : borderSize + offset;
			
			let x, y;
			if (side === LEFT || side === RIGHT) {
				x = (side === LEFT) ? centerToEdge : pieceWidth - centerToEdge;
				y = pieceHeight / 2;
			} else {
				x = pieceWidth / 2;
				y = (side === TOP) ? centerToEdge : pieceHeight - centerToEdge;
			}
			
			return e('mask', {id: name, key: name}, [
				e('circle', {
					fill: '#FFFFFF',
					cx: x,
					cy: y,
					r: radius,
					key: 0
				})
			])
		}

		createMasks() {
			const borderSize = this.props.borderSize;
			const offset = this.props.offset;

			const boxWidth = this.props.imgWidth / this.props.cols;
			const pieceWidth = boxWidth + 2 * borderSize;
			
			const boxHeight = this.props.imgHeight / this.props.rows;
			const pieceHeight = boxHeight + 2 * borderSize;

			const masks = [];

			// Default mask (rectangular middle area)
			masks.push(e('mask', {id: 'main', key: 'main'}, [
				e('rect', {
					fill: '#000000',
					x: 0,
					y: 0,
					width: pieceWidth,
					height: pieceHeight,
					key: 0
				}),
				e('rect', {
					fill: '#FFFFFF',
					x: borderSize,
					y: borderSize,
					width: boxWidth,
					height: boxHeight,
					key: 1
				})
			]));

			for (let side of [LEFT, TOP, RIGHT, BOTTOM]) {
				for (let type of [BUMP, RECESS]) {
					masks.push(this.createSideMask(side, type, borderSize, offset, pieceHeight, pieceWidth));
				}
			}

			return e('svg', {height: 0, width: 0, key: -1}, masks);
		}

		getRandomEdgeType() {
			const types = [BUMP, RECESS];
			return types[randomInt(types.length)];
		}
		
		getOppositeEdge(edge) {
			switch(edge) {
				case BUMP:
					return RECESS;
				case RECESS:
					return BUMP;
				default:
					throw Error(`getOppositeEdge: ${edge} does not have an opposite edge type`);
			}
		}

		createPieces() {
			const borderSize = this.props.borderSize;

			const boxWidth = this.props.imgWidth / this.props.cols;
			const pieceWidth = boxWidth + 2 * borderSize;

			const boxHeight = this.props.imgHeight / this.props.rows;
			const pieceHeight = boxHeight + 2 * borderSize;

			const availableKeys = range(this.props.cols * this.props.rows);
			const keys = Array(this.props.cols).fill(Array(this.props.rows));
			const pieces = [];
			for (let i = 0; i < this.props.cols; i++) {
				for (let j = 0; j < this.props.rows; j++) {
					const keyIndex = randomInt(availableKeys.length);
					const key = availableKeys.splice(keyIndex, 1)[0];
					
					const leftPos = (boxWidth + 2) * i - this.props.borderSize;  // (temp)
					const topPos = (boxHeight + 2) * j - this.props.borderSize;  // (temp)
					
					const bgLeft = -boxWidth * i + this.props.borderSize;
					const bgTop = -boxHeight * j + this.props.borderSize;
					
					const neighbors = {};
					neighbors[LEFT] = (i > 0) ? keys[i - 1][j] : undefined;
					neighbors[TOP] = (j > 0) ? keys[i][j - 1] : undefined;
					
					const edges = {};
					edges[LEFT] = (i === 0) ? FLAT : this.getOppositeEdge(neighbors[LEFT].edges[RIGHT]);
					edges[TOP] = (j === 0) ? FLAT : this.getOppositeEdge(neighbors[TOP].edges[BOTTOM]);
					edges[RIGHT] = (i === this.props.cols - 1) ? FLAT : this.getRandomEdgeType();
					edges[BOTTOM] = (j === this.props.rows - 1) ? FLAT : this.getRandomEdgeType();

					keys[i][j] = {key: key, edges: edges};

					const piece = (e(Piece, {
						key: key,
						keystr: key + '',
						col: i, row: j,
						width: pieceWidth, height: pieceHeight,
						left: leftPos, top: topPos,
						bgLeft: bgLeft, bgTop: bgTop,
						edges: edges,
						neighbors: neighbors
					}));
					pieces.splice(randomInt(pieces.length), 0, piece);  // use push to keep in order for debugging
				}
			}
			return pieces;
		}

		render() {
			return e('div', {}, [this.state.masks].concat(this.state.pieces));
		}
	}
	
	function renderRoot() {
		const domContainer = document.getElementById('puzzle_container');
		ReactDOM.render(e(Puzzle, { imgWidth: 1221, imgHeight: 823, borderSize: 30, offset: 10, rows: 7, cols: 10 }), domContainer);
	}
	
	window.addEventListener('DOMContentLoaded', renderRoot);
}());