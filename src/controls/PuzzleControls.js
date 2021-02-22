import { Component } from 'react';

import ImagePicker from './ImagePicker';
import presetImages from './providedImages';


const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends Component {
    constructor(props) {
        super(props);

        this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
        this.handleDimensionsBlur = this.handleDimensionsBlur.bind(this);
        
        this.setSelectedImage = this.setSelectedImage.bind(this);
        this.newPuzzle = this.newPuzzle.bind(this);
        
        this.state = {
            selectedImage: presetImages[0],
            rows: presetImages[0].defaultRows,
            cols: presetImages[0].defaultCols
        };
    }

    componentDidMount() {
        this.newPuzzle();
    }

    handleDimensionsChange(e) {
        this.setState({[e.target.name]: e.target.valueAsNumber});
    }

    handleDimensionsBlur(e) {
        this.setState({[e.target.name]: this.validateDimension(e.target.value)});
    }

    validateDimension(val) {
        let result = parseInt(val, 10);
        if (isNaN(result) || result < minPuzzleDimension) {
            result = minPuzzleDimension;
        } else if (result > maxPuzzleDimension) {
            result = maxPuzzleDimension;
        }
        return result;
    }

    setSelectedImage(imageInfo) {
        const rows = imageInfo ? imageInfo.defaultRows : this.state.rows;
        const cols = imageInfo ? imageInfo.defaultCols : this.state.cols;
        this.setState({selectedImage: imageInfo, rows: rows, cols: cols});
    }

    newPuzzle() {
        if (!this.state.selectedImage) {
            return;
        }

        const rows = this.validateDimension(this.state.rows);
        const cols = this.validateDimension(this.state.cols);

        const img = this.state.selectedImage;
        document.documentElement.style.setProperty('--puzzle-img', `url(${img.url})`);
        
        const sizeTester = new Image();
        sizeTester.onerror = () => console.log("Failed to load image");
        sizeTester.onload = () => this.props.newPuzzle(sizeTester.naturalWidth, sizeTester.naturalHeight, rows, cols, img);
        sizeTester.src = img.url;
    };

    render() {
        const rowsVal = isNaN(this.state.rows) ? '' : this.state.rows;
        const colsVal = isNaN(this.state.cols) ? '' : this.state.cols;

        return (
            <form className='container mt-4'>
                <div className='form-group row'>
                    <ImagePicker setSelectedImage={this.setSelectedImage} minPuzzleDimension={minPuzzleDimension}/>
                </div>

                <div className='form-group row justify-content-center'>
                    <label className='mr-2 my-2 col-form-label' htmlFor='row-input'>Rows:</label>
                    <input className='mr-2 my-2' id={'row-input'} type='number' min={minPuzzleDimension} max={maxPuzzleDimension}
                        name='rows' value={rowsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    
                    <label className='mr-2 my-2 col-form-label' htmlFor='col-input'>Columns:</label>
                    <input className='mr-4 my-2' id='col-input' type='number' min={minPuzzleDimension} max={maxPuzzleDimension} 
                        name='cols' value={colsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    
                    <button className='btn btn-dark btn-lg' type='button' disabled={!this.state.selectedImage} onClick={this.newPuzzle}>New puzzle</button>
                </div>
            </form>
        );
    }
}