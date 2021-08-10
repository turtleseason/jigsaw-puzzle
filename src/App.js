import { Component, createRef } from 'react';

import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import PieceModel from './puzzle/PieceModel.js';
import Puzzle from './puzzle/Puzzle.js';
import PuzzleControls from './controls/PuzzleControls.js';
import PuzzleState from './puzzle/PuzzleState.js';
import PuzzleTitle from './title/PuzzleTitle.js';

export default class App extends Component {
    puzzle = createRef();

    state = {
        puzzleKey: 1,
        image: {
            width: null,
            height: null,
            info: null,
        },
        rows: null,
        cols: null,
        savedPieces: null,
        error: null,
    };

    newPuzzle = (width, height, rows, cols, image) => {
        const { savedPieces, image: oldImage } = this.state;
        if (savedPieces && oldImage.info.type === 'user') {
            URL.revokeObjectURL(oldImage.info.url);
        }

        this.setState(state => ({
            puzzleKey: state.puzzleKey + 1,
            image: {
                width,
                height,
                info: image,
            },
            rows,
            cols,
            savedPieces: null,
        }));
    };

    saveUserImage = async (url) => {
        // Fetch the image blob using the local URL from createObjectURL().
        const userImage = await fetch(url).then(response => response.blob());

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    try {
                        localStorage.setItem('latestSaveImage', reader.result);
                        resolve(true);
                    } catch (error) {
                        this.setState({
                            error: 'Failed to save image; it may be too large to store in localStorage (limit: roughly 3.75MB).'
                        });
                        console.log(error);
                        resolve(false);
                    }
                } else {
                    this.setState({ error: 'Failed to save image: can\'t read image.' });
                    resolve(false);
                }
            };
            reader.readAsDataURL(userImage);
        });
    };

    savePuzzle = async () => {
        // Calling a method on a child component isn't idiomatic in React, but I feel like keeping the 'pieces' state
        // with the rest of the puzzle logic (vs. lifting it up to App) is worth it here.
        const pieces = this.puzzle.current.getGameState();

        const { image, rows, cols } = this.state;
        const state = new PuzzleState(pieces, rows, cols, image.width, image.height, image.info);

        try {
            if (localStorage.getItem('latestSaveImage')) {
                localStorage.removeItem('latestSaveImage');
            }
            localStorage.setItem('latestSave', JSON.stringify(state));
        } catch (error) {
            this.setState({
                error: 'Failed to save puzzle; localStorage may be full or unavailable (e.g. in a private browsing window).'
            });
            console.log(error);
            return false;
        }

        if (image.info.type === 'user') {
            return await this.saveUserImage(image.info.url);
        } else {
            return true;
        }
    };

    loadPuzzle = async () => {
        let save;
        try {
            save = JSON.parse(localStorage.getItem('latestSave'), (key, value) => {
                if (key === 'pieces') {
                    return value.map(piece => Object.assign(new PieceModel(), piece));
                } else {
                    return value;
                }
            });

            if (save.imageInfo.type === 'user') {
                // Using even a moderately-sized image data URL directly slows down the browser, so convert it back to blob
                const blob = await fetch(localStorage.getItem('latestSaveImage')).then(response => response.blob());
                save.imageInfo.url = URL.createObjectURL(blob);
            }
        }
        catch (error) {
            this.setState({ error: "Failed to load saved puzzle." });
            console.log(error);
            return;
        }

        this.setState(state => ({
            puzzleKey: state.puzzleKey + 1,
            image: {
                width: save.imageWidth,
                height: save.imageHeight,
                info: save.imageInfo,
            },
            rows: save.rows,
            cols: save.cols,
            savedPieces: save.pieces,
        }));
    };

    handleToastDismiss = () => {
        this.setState({ error: null });
    };

    render() {
        const { puzzleKey, image, rows, cols, savedPieces, error } = this.state;

        return (<>
            <PuzzleControls newPuzzle={this.newPuzzle} savePuzzle={this.savePuzzle} loadPuzzle={this.loadPuzzle} />
            {image.info &&
                <>
                    <PuzzleTitle puzzleImage={image.info} />
                    <Puzzle
                        ref={this.puzzle}
                        key={puzzleKey}
                        imgUrl={image.info.url}
                        imgWidth={image.width}
                        imgHeight={image.height}
                        rows={rows}
                        cols={cols}
                        pieces={savedPieces}
                    />
                </>}
            <Toast isOpen={!!error}>
                <ToastHeader toggle={this.handleToastDismiss}>Error</ToastHeader>
                <ToastBody>{error}</ToastBody>
            </Toast>
        </>);
    }
};