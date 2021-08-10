import { PureComponent } from 'react';
import ClipPath from './ClipPath.js';


export default class ClipPathContainer extends PureComponent {
    renderClipPath(model) {
        return <ClipPath key={model.key} edgeDrawer={this.props.edgeDrawer} pieceKey={model.key} edges={model.edges} />;
    }

    render() {
        const children = this.props.pieces?.map(model => this.renderClipPath(model));
        return (
            <svg width='0' height='0' aria-hidden='true' data-testid='clip-path-container'>
                {children}
            </svg>
        );
    }
}