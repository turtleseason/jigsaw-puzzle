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

    // Gets the offset of the puzzle's current position (measured by the top left piece)
    // from the position where it would be centered within the game board.
    getPuzzleOffsetFromCenter() {
        const boardSize = this.props.getBoardDimensions();
        const topLeftPiece = this.props.pieces[this.props.topLeftKey].pos;

        const centerLeft = (boardSize.width / this.props.scaleFactor - this.props.imgWidth) / 2;
        const centerTop = (boardSize.height / this.props.scaleFactor - this.props.imgHeight) / 2;

        const imageLeft = topLeftPiece.left + this.props.borderSize;
        const imageTop = topLeftPiece.top + this.props.borderSize;

        return { left: imageLeft - centerLeft, top: imageTop - centerTop, };
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

        const board = gameComplete ? (
            <div className='puzzle-area' style={boardStyle}>
                <PuzzleCompleteImage
                    imgUrl={this.imgUrl}
                    startPos={this.getPuzzleOffsetFromCenter()}
                    width={this.imgWidth}
                    height={this.imgHeight}
                />
            </div>
        ) : (
            <div
                className={'puzzle-area' + (draggedPiece !== null ? ' no-scroll' : '')}
                style={boardStyle}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <ClipPathContainer edgeDrawer={this.edgeDrawer} pieces={pieces} />
                {pieces?.map(model => this.renderPiece(model))}
            </div>
        );

        return (
            <div className='puzzle-container pt-2 pb-3'>
                <div className='puzzle-background'></div>
                {board}
            </div>
        );
    }
}