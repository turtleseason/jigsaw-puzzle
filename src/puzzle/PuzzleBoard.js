// Handles displaying the puzzle using state passed down from Puzzle.

import { Component } from "react";

import ClipPathContainer from './ClipPathContainer';
import EdgePathDrawer from './EdgePathDrawer';
import Piece from './Piece';
import PuzzleCompleteImage from './PuzzleCompleteImage';

export default class PuzzleBoard extends Component {
    imgUrl = this.props.imgUrl;
    imgWidth = this.props.imgWidth;
    imgHeight = this.props.imgHeight;
    pieceWidth = this.props.pieceWidth;
    pieceHeight = this.props.pieceHeight;

    edgeDrawer = new EdgePathDrawer(this.props.pieceWidth, this.props.pieceHeight, this.props.borderSize);

    state = {
        endAnimationComplete: false,
    };

    handleTransitionEnd = () => {
        this.setState({ endAnimationComplete: true });
    };

    // Gets the current position of the piece representing the top left corner of the puzzle image
    // (for lining up the completed puzzle image when the puzzle is completed).
    getTopLeftPos() {
        const pos = this.props.pieces[this.props.topLeftKey].pos;
        return { left: pos.left + this.props.borderSize, top: pos.top + this.props.borderSize };
    }

    // Gets the top-left position of the full puzzle image when it's centered within the game board area. 
    getCenteredImagePos() {
        const dimensions = this.props.getBoardDimensions();
        const left = (dimensions.width / this.props.scaleFactor - this.props.imgWidth) / 2;
        const top = (dimensions.height / this.props.scaleFactor - this.props.imgHeight) / 2;
        return { left, top };
    }

    renderPiece(model) {
        return (
            <Piece
                key={model.key}
                model={model}
                width={this.pieceWidth}
                height={this.pieceHeight}
                imgUrl={this.imgUrl}
                blockPointerEvents={this.props.draggedPiece !== null}
                onPointerDown={this.props.pointerDownHandlers[model.key]} />
        );
    }

    render() {
        const { scaleFactor, pieces, draggedPiece, gameComplete, onPointerMove, onPointerUp } = this.props;

        const boardStyle = {
            transform: `scale(${scaleFactor})`,
            width: (100 / scaleFactor) + '%',
            height: (100 / scaleFactor) + '%'
        };

        let board;
        if (gameComplete && this.state.endAnimationComplete) {
            board = (<div className='puzzle-area puzzle-complete' style={boardStyle}></div>);
        } else if (gameComplete) {
            board = (
                <div className='puzzle-area' style={boardStyle}>
                    <PuzzleCompleteImage
                        imgUrl={this.imgUrl}
                        startPos={this.getTopLeftPos()}
                        destPos={this.getCenteredImagePos()}
                        width={this.imgWidth}
                        height={this.imgHeight}
                        onTransitionEnd={this.handleTransitionEnd} />
                </div>);
        } else {
            const children = pieces?.map(model => this.renderPiece(model));
            board = (
                <div
                    className={'puzzle-area' + (draggedPiece !== null ? ' no-scroll' : '')}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    style={boardStyle}>
                    <ClipPathContainer edgeDrawer={this.edgeDrawer} pieces={pieces} />
                    {children}
                </div>);
        }

        return (
            <div className='puzzle-container mt-2'>
                <div className='puzzle-background'></div>
                {board}
                {/* Use a separate div for padding because adding padding directly to the puzzle container
                    can cause the game-completed image to jump at the end of its motion */}
                <div className='pb-3'></div>
            </div>
        );
    }
}