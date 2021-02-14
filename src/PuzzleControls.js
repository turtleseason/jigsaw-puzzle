import { Component } from 'react';
import { ImageInfo, ImageSource } from './PuzzleImage';


const presetImages = [
    new ImageInfo('Roses', 'images/van-gogh-roses-nga.jpg', 8, 10, 'Vincent van Gogh', new ImageSource('National Gallery of Art', true, false)),
    new ImageInfo('Moonlit field', 'images/luca-huter-vFrhuBvI-hI-unsplash.jpg', 7, 10, 'Luca Huter', new ImageSource('unsplash', false, true)),
    new ImageInfo('Wish', 'images/casey-horner-80UR4DM2Rz0-unsplash.jpg', 7, 10, 'Casey Horner', new ImageSource('unsplash', true, true)),
    new ImageInfo('Coral', 'images/david-clode-eOSqRq2Qm1c-unsplash.jpg', 7, 10, 'David Clode', new ImageSource('unsplash', false, true)),
    new ImageInfo('Jellyfish', 'images/travel-sourced-FsmcD6uKcHk-unsplash.jpg', 7, 10, 'Travel Sourced', new ImageSource('unsplash', false, true)),
    new ImageInfo('Succulents', 'images/scott-webb-lYzgtps0UtQ-unsplash.jpg', 11, 7, 'Scott Webb', new ImageSource('unsplash', false, true)),
    new ImageInfo('freebirb', 'lunar_festival.png', 7, 10, 'Kan Gao'),
];

const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends Component {
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
        sizeTester.onload = () => this.props.newPuzzle(sizeTester.width, sizeTester.height, this.state.rows, this.state.cols, this.state.selectedImage);
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