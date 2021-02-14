import React from 'react';
import PuzzleImage from './PuzzleImage';


const presetImages = [
    new PuzzleImage('Roses', 'images/van-gogh-roses-nga.jpg', 'Vincent van Gogh', 'National Gallery of Art', 8, 10),
    new PuzzleImage('Moonlit field', 'images/luca-huter-vFrhuBvI-hI-unsplash.jpg', 'Luca Huter', 'unsplash', 7, 10),
    new PuzzleImage('Wish', 'images/casey-horner-80UR4DM2Rz0-unsplash.jpg', 'Casey Horner', 'unsplash', 7, 10),
    new PuzzleImage('Coral', 'images/david-clode-eOSqRq2Qm1c-unsplash.jpg', 'David Clode', 'unsplash', 7, 10),
    new PuzzleImage('Jellyfish', 'images/travel-sourced-FsmcD6uKcHk-unsplash.jpg', 'Travel Sourced', 'unsplash', 7, 10),
    new PuzzleImage('Succulents', 'images/scott-webb-lYzgtps0UtQ-unsplash.jpg', 'Scott Webb', 'unsplash', 11, 7),
    new PuzzleImage('freebirb', 'lunar_festival.png', 'Kan Gao', 'twitter', 7, 10),
];

const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.newPuzzle = this.newPuzzle.bind(this);
        this.handleDimensionsChange = this.handleDimensionsChange.bind(this);

        this.state = {
            selectedImage: presetImages[0],
            rows: presetImages[0].defaultRows,
            cols: presetImages[0].defaultCols
        };
    }

    componentDidMount() {
        this.newPuzzle();
    }

    handleSelectChange(e) {
        const select = e.target;
        if (select.selectedIndex !== -1) {
            const option = select.options[select.selectedIndex];
            const img = presetImages[option.getAttribute('data-index')];
            this.setState({selectedImage: img, rows: img.defaultRows, cols: img.defaultCols});
        }
    }

    handleDimensionsChange(e) {
        this.setState({[e.target.name]: parseInt(e.target.value, 10)});
    }

    isValidDimension(val) {
        return (!isNaN(val) && val >= minPuzzleDimension && val <= maxPuzzleDimension);
    }

    newPuzzle() {
        if (!this.isValidDimension(this.state.rows) || !this.isValidDimension(this.state.cols)) {
            return;
        }

        const imageUrl = this.state.selectedImage.url;
        document.documentElement.style.setProperty('--puzzle-img', `url(${imageUrl})`);
        
        const sizeTester = new Image();
        sizeTester.onload = () => this.props.newPuzzle(sizeTester.width, sizeTester.height, this.state.rows, this.state.cols);
        sizeTester.src = imageUrl;
    };

    renderSelectOptions() {
        const options = [];
        for (let i = 0; i < presetImages.length; i++) {
            const img = presetImages[i];
            options.push(<option key={i} value={img.url} data-index={i}>{img.name}</option>);
        }
        return options;
    }

    render() {
        const selectId = 'puzzle-image-select';
        const rowInputId = 'row-input';
        const colInputId = 'col-input';

        return (
            <div className='container mt-4'>
                <form className='form-inline justify-content-center'>
                    <label className='mr-2' htmlFor={selectId}>Choose an image:</label>
                    <select id={selectId} className='custom-select mr-sm-4 mb-2 mb-md-0' onChange={this.handleSelectChange}>
                        {this.renderSelectOptions()}
                    </select>
                    <label className='mr-2' htmlFor={rowInputId}>Rows:</label>
                    <input id={rowInputId} className='mr-2' type='number' min={minPuzzleDimension} max={maxPuzzleDimension}
                           name='rows' value={this.state.rows} onChange={this.handleDimensionsChange}/>
                    <label className='mr-2' htmlFor={colInputId}>Columns:</label>
                    <input id={colInputId} className='mr-4' type='number' min={minPuzzleDimension} max={maxPuzzleDimension} 
                           name='cols' value={this.state.cols} onChange={this.handleDimensionsChange}/>
                    <button className='btn btn-light' type='button' onClick={this.newPuzzle}>New puzzle</button>
                </form>
            </div>
        );
    }
}