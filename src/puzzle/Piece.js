import { PureComponent } from 'react';


export default class Piece extends PureComponent {
    constructor(props) {
        super(props);

        // This never changes over the lifetime of the object, so just calculate it once
        const bgPos = this.props.model.bgPos;
        this.backgroundPositionString = `${bgPos.left}px ${bgPos.top}px`;
    }
    
    render() {
        const model = this.props.model;
        const className = 'puzzle-piece' + (this.props.blockPointerEvents ? ' block-pointer-events' : '');
        return (
            <svg
                className={className}
                data-id={model.key}
                onPointerDown={(e) => this.props.onPointerDown(e)}
                clipPath={'url(#clip-' + model.key + ')'}
                style={{
                    backgroundPosition: this.backgroundPositionString,
                    width: this.props.width,
                    height: this.props.height,
                    left: model.displayPos.left,
                    top: model.displayPos.top,
                    zIndex: (model.zIndex > 0 ? model.zIndex : 'auto')
                }}>
            </svg>
        );
    }
}