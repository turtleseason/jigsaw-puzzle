import { Component } from 'react';

import ImagePicker from './ImagePicker';
import SettingsModal from './SettingsModal';
import presetImages from './presetImages';

const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends Component {
    state = {
        modalOpen: false,
        selectedImage: presetImages[0],
        rows: presetImages[0].defaultRows,
        cols: presetImages[0].defaultCols
    };

    componentDidMount() {
        this.newPuzzle();
    }

    toggleModal = () => {
        this.setState((state) => { return { modalOpen: !state.modalOpen }; });
    };

    setSelectedImage = (selectedImage) => {
        if (selectedImage !== this.state.selectedImage) {
            const rows = selectedImage?.defaultRows ?? this.state.rows;
            const cols = selectedImage?.defaultCols ?? this.state.cols;
            this.setState({ selectedImage, rows, cols });
        }
    };

    setDimension = (name, val) => {
        this.setState({ [name]: val });
    };

    newPuzzle = () => {
        if (!this.state.selectedImage) {
            return;
        }

        const img = this.state.selectedImage;
        document.documentElement.style.setProperty('--puzzle-img', `url(${img.url})`);

        const sizeTester = new Image();
        sizeTester.onerror = () => console.log("Failed to load image");
        sizeTester.onload = () => this.props.newPuzzle(
            sizeTester.naturalWidth,
            sizeTester.naturalHeight,
            this.state.rows,
            this.state.cols,
            img
        );
        sizeTester.src = img.url;
    };

    render() {
        return (
            <div className='container mt-4'>
                <div className='row mb-3'>
                    <ImagePicker setSelectedImage={this.setSelectedImage} minPuzzleDimension={minPuzzleDimension} />
                </div>

                <div className='row justify-content-center align-items-end mx-n1'>
                    <div className='col d-none d-md-block px-2'></div>

                    <div className='col-auto px-2'>
                        <button className='btn btn-dark btn-lg px-4' type='button' onClick={this.newPuzzle} disabled={!this.state.selectedImage}>
                            New puzzle
                        </button>
                    </div>

                    <div className='col-auto col-md px-2'>
                        <button className='btn btn-outline-dark' type='button' onClick={this.toggleModal}>
                            <i className='bi bi-gear-fill pr-2'></i>Settings
                        </button>
                    </div>

                    <SettingsModal
                        toggleModal={this.toggleModal}
                        saveGame={this.props.savePuzzle}
                        loadGame={this.props.loadPuzzle}
                        isOpen={this.state.modalOpen}
                        rows={this.state.rows}
                        cols={this.state.cols}
                        setDimension={this.setDimension}
                        minPuzzleDimension={minPuzzleDimension}
                        maxPuzzleDimension={maxPuzzleDimension}
                    />
                </div>
            </div>
        );
    }
}