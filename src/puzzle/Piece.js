import { PureComponent } from 'react';
import { Sides } from './Sides';


export default class Piece extends PureComponent {
    constructor(props) {
        super(props);

        const bgPos = this.props.model.bgPos;
        // These will never change over the lifetime of the object, so just calculate them once
        this.backgroundPositionString = `${bgPos.left}px ${bgPos.top}px`;
        this.clipPathString = this.getClipPathString(this.props.edgeDrawer);
    }
    
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
        return (
            <div
                className={className}
                tempid={model.key}
                onPointerDown={(e) => this.props.onPointerDown(e)}
                style={{
                    backgroundPosition: this.backgroundPositionString,
                    clipPath: this.clipPathString,
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