import { PureComponent } from 'react';
import { Sides } from './Sides.js';


export default class ClipPath extends PureComponent {
    getClipPathString(edges) {
        let clipPathString = '';
        for (const side of Sides) {
            clipPathString += this.props.edgeDrawer.getPathString(side, edges[side]);
        }
        return clipPathString;
    }

    render() {
        return (
            <clipPath id={'clip-' + this.props.pieceKey}>
                <path d={this.getClipPathString(this.props.edges)} />
            </clipPath>
        );
    }
}