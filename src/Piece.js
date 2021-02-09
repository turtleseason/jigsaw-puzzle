import React from 'react';


const e = React.createElement;

class Piece extends React.Component {
	render() {
		const backgroundPositionString = `${this.props.bgPos.left}px ${this.props.bgPos.top}px`; 
		const clipPathString = 'path(\'' + this.props.clipPathString + '\')';

		return e('div', {
			className: 'puzzle_piece',
			tempid: this.props.keystr,
			onMouseDown: (e) => this.props.onMouseDown(e),
			onMouseUp: (e) => this.props.onMouseUp(e),
			style: {
				backgroundPosition: backgroundPositionString,
				clipPath: clipPathString,
				width: this.props.width,
				height: this.props.height,
				left: this.props.pos.left,
				top: this.props.pos.top,
				zIndex: this.props.zIndex
			}
		});
	}
}

export default Piece;