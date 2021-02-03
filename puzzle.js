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
			const positionX = -this.props.width * this.props.col;
			const positionY = -this.props.height * this.props.row;
			return e('div', {
				className: 'puzzle_piece',
				mykeylol: this.props.keystr,
				style: {
					backgroundPosition: `${this.props.bgLeft}px ${this.props.bgTop}px`,
					width: this.props.width,
					height: this.props.height,
					left: this.props.left,
					top: this.props.top,
					mask: this.props.maskString
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

		createPieces() {
			const borderSize = this.props.borderSize;

			const boxWidth = this.props.imgWidth / this.props.cols;
			const pieceWidth = boxWidth + 2 * borderSize;

			const boxHeight = this.props.imgHeight / this.props.rows;
			const pieceHeight = boxHeight + 2 * borderSize;

			const availableKeys = range(this.props.cols * this.props.rows);
			const pieces = [];
			for (let i = 0; i < this.props.cols; i++) {
				for (let j = 0; j < this.props.rows; j++) {
					const keyIndex = randomInt(availableKeys.length);
					const key = availableKeys.splice(keyIndex, 1)[0];

					const left = (boxWidth + 2) * i - this.props.borderSize;  // (temp)
					const top = (boxHeight + 2) * j - this.props.borderSize;  // (temp)

					const bgLeft = -boxWidth * i + this.props.borderSize;
					const bgTop = -boxHeight * j + this.props.borderSize;

					// p.left = flat if i == 0 else pickRandom;
					// p.top = flat if j == 0 else pickRandom;
					// p.right = flat if i == numColumns - 1 else pickRandom;
					// p.bottom = flat if j == numRows - 1 else pickRandom;
					
					// p.leftPiece = null if i == 0 else pieces[i - 1, j];
					// p.topPiece = null if j == 0 else pieces[i, j - i];
					// p.rightPiece = p.bottomPiece = null;

					const maskString = `url(#bLeft), url(#bTop), url(#main) subtract, url(#rRight), url(#rBottom)`;
					pieces.push(e(Piece, {
						key: key,
						keystr: key + '',
						col: i, row: j,
						width: pieceWidth, height: pieceHeight,
						left: left, top: top,
						bgLeft: bgLeft, bgTop: bgTop,
						maskString: maskString
					}));
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