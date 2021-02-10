import React from 'react';
import { Sides } from './Sides.js';


class Piece extends React.Component {
	getClipPathString(edgeDrawer) {
		let clipPathString = 'path(\'';
		for (const side of Sides) {
			clipPathString += edgeDrawer.getPathString(side, this.props.model.edges[side]);
		}
		return clipPathString + '\')';
	}

	render() {
		const model = this.props.model;

		const className = 'puzzle-piece' + (this.props.blockPointerEvents ? ' block-pointer-events' : '');
		const backgroundPositionString = `${model.bgPos.left}px ${model.bgPos.top}px`; 
		const clipPathString = this.getClipPathString(this.props.edgeDrawer);

		return (
			<div
				className={className}
				tempid={model.key}
				onMouseDown={(e) => this.props.onMouseDown(e)}
				style={{
					backgroundPosition: backgroundPositionString,
					clipPath: clipPathString,
					width: this.props.width,
					height: this.props.height,
					left: model.pos.left,
					top: model.pos.top,
					zIndex: (model.zIndex > 0 ? model.zIndex : 'auto')
				}}>
			</div>
		);
	}
}

export default Piece;