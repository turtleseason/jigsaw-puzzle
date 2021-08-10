import { PureComponent } from 'react';

export default class Piece extends PureComponent {
    render() {
        const model = this.props.model;
        return (
            // Set the position on a wrapper div because if it's set directly on the svg, Firefox fails to re-render
            // with the updated position when pieces 'snap' together, for some reason
            <div style={{ left: model.displayPos.left, top: model.displayPos.top, position: 'absolute' }}>
                <svg
                    className='puzzle-piece'
                    aria-label='Puzzle piece'
                    data-id={model.key}
                    width={this.props.width}
                    height={this.props.height}
                    clipPath={`url(#clip-${model.key})`}
                    style={{ zIndex: (model.zIndex > 0 ? model.zIndex : 'auto') }}
                    onPointerDown={this.props.onPointerDown}>
                    <image
                        href={this.props.imgUrl}
                        x={this.props.model.imageOffset.left}
                        y={this.props.model.imageOffset.top}
                        onDragStart={(e) => e.preventDefault()} />
                </svg>
            </div>
        );
    }
}