// When the puzzle is finished, the separate pieces merge together into a single image and animate towards the center of the board.
//
// (Once the animation completes, this image is replaced with a background image on the puzzle board
//  because the background image can automatically adjust its position when the page is resized,
//  which is simpler and easier than keeping it centered manually.)

import { Component } from 'react';

export default class PuzzleCompleteImage extends Component {
    state = { ...this.props.startPos };

    componentDidMount() {
        // Change on the second frame to ensure the image is drawn at the original position at least once.
        requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ top: 0, left: 0 })));
    }

    handleTransitionEnd = () => {
        this.setState({ animationComplete: true });
    };

    render() {
        return (
            <img
                className='puzzle-complete-img'
                src={this.props.imgUrl}
                alt='Completed puzzle'
                width={this.props.width}
                height={this.props.height}
                style={this.state}
                onTransitionEnd={this.handleTransitionEnd} />
        );
    }
}