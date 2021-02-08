import React from 'react';

const e = React.createElement;

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

export default Piece;