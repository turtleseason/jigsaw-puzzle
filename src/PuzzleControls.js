import { Component } from 'react';
import presetImages from './providedImages';


const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends Component {
    constructor(props) {
        super(props);

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
        this.handleDimensionsBlur = this.handleDimensionsBlur.bind(this);
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

    handleSelectChange(e) {
        const select = e.target;
        if (select.selectedIndex !== -1) {
            const option = select.options[select.selectedIndex];
            const img = presetImages[option.getAttribute('data-index')];
            this.setState({selectedImage: img, rows: img.defaultRows, cols: img.defaultCols});
        }
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

    newPuzzle() {
        const rows = this.validateDimension(this.state.rows);
        const cols = this.validateDimension(this.state.cols);

        const imageUrl = this.state.selectedImage.url;
        document.documentElement.style.setProperty('--puzzle-img', `url(${imageUrl})`);
        
        const sizeTester = new Image();
        sizeTester.onload = () => this.props.newPuzzle(sizeTester.width, sizeTester.height, rows, cols, this.state.selectedImage);
        sizeTester.src = imageUrl;
    };

    renderSelectOptions() {
        const options = [];
        for (let i = 0; i < presetImages.length; i++) {
            const img = presetImages[i];
            options.push(<option key={i} value={img.url} data-index={i}>{img.shortName}</option>);
        }
        return options;
    }

    render() {
        const selectId = 'puzzle-image-select';
        const rowInputId = 'row-input';
        const colInputId = 'col-input';

        const rowsVal = isNaN(this.state.rows) ? '' : this.state.rows;
        const colsVal = isNaN(this.state.cols) ? '' : this.state.cols;

        return (
            <div className='container mt-4'>
                <form className='form-inline justify-content-center'>
                    <label className='mr-2' htmlFor={selectId}>Choose an image:</label>
                    <select id={selectId} className='custom-select mr-sm-4 mb-2 mb-md-0' onChange={this.handleSelectChange}>
                        {this.renderSelectOptions()}
                    </select>
                    <div className='w-100 d-md-none'></div>
                    <label className='mr-2' htmlFor={rowInputId}>Rows:</label>
                    <input id={rowInputId} className='mr-2' type='number' min={minPuzzleDimension} max={maxPuzzleDimension}
                           name='rows' value={rowsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    <label className='mr-2' htmlFor={colInputId}>Columns:</label>
                    <input id={colInputId} className='mr-4' type='number' min={minPuzzleDimension} max={maxPuzzleDimension} 
                           name='cols' value={colsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    <button className='btn btn-dark' type='button' onClick={this.newPuzzle}>New puzzle</button>
                </form>
            </div>
        );
    }
}