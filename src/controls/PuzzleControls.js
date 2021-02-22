import React, { Component } from 'react';
import { CustomInput } from 'reactstrap';
import { ImageInfo } from './ImageInfo';

import { clamp } from '../util';

import presetImages from './providedImages';


const minPuzzleDimension = 2;
const maxPuzzleDimension = 25;

export default class PuzzleControls extends Component {
    constructor(props) {
        super(props);

        this.fileInput = React.createRef();

        this.selectedPreset = presetImages[0];
        this.userImage = null;
        
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
        this.handleDimensionsBlur = this.handleDimensionsBlur.bind(this);
        this.handleRadioKeyDown = this.handleRadioKeyDown.bind(this);
        this.useUserImage = this.useUserImage.bind(this);
        this.usePresetImage = this.usePresetImage.bind(this);
        this.newPuzzle = this.newPuzzle.bind(this);
        
        this.state = {
            usingUserImage: false,
            invalidUserImage: false,
            rows: presetImages[0].defaultRows,
            cols: presetImages[0].defaultCols
        };
    }

    get selectedImage () {
        return this.state.usingUserImage ? this.userImage : this.selectedPreset;
    }

    componentDidMount() {
        this.newPuzzle();
    }

    usePresetImage() {
        this.setState({usingUserImage: false});
    }

    useUserImage() {
        this.setState({usingUserImage: true});
    }

    // Maintain arrow key navigation between the radio buttons even though they aren't
    // actually part of the same radio group (so that they can be separate tab stops).
    handleRadioKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'Left':
            case 'Up':
                if (e.target.id === 'radioBtn2') {
                    document.getElementById('radioBtn1').focus();
                    e.preventDefault();
                }
                return;
            case 'ArrowRight':
            case 'ArrowDown':
            case 'Down':
            case 'Right':
                if (e.target.id === 'radioBtn1') {
                    document.getElementById('radioBtn2').focus();
                    e.preventDefault();
                }
                return;
        }
    }

    handleSelectChange(e) {
        this.usePresetImage();

        const select = e.target;
        if (select.selectedIndex !== -1) {
            const img = presetImages[select.selectedIndex];
            this.selectedPreset = img;
            this.setState({rows: img.defaultRows, cols: img.defaultCols});
        }
    }

    handleFileChange() {
        this.useUserImage();

        const file = this.fileInput.current.files[0];
        const fileUrl = URL.createObjectURL(file);

        const testLoader = new Image();
        testLoader.onerror = () => {
            URL.revokeObjectURL(fileUrl);
            this.setState({invalidUserImage: true});
        };
        testLoader.onload = () => {
            if (this.userImage) {
                URL.revokeObjectURL(this.userImage.url);
            }
            const dim = this.generateDefaultDimensions(testLoader.naturalWidth, testLoader.naturalHeight);
            this.userImage = new ImageInfo(file.name, fileUrl, dim.rows, dim.cols);
            this.setState({invalidUserImage: false, rows: dim.rows, cols: dim.cols});
        };
        testLoader.src = fileUrl;
    }

    // Tries to choose a good default based on the image aspect ratio;
    // could go further and tailor the target rows+columns to the viewport size
    generateDefaultDimensions(width, height) {
        const target = 15;
        const aspect = width / height;

        // cols = (width / height) * rows
        // cols + rows = target
        const rows = clamp(Math.round(target / (aspect + 1)), minPuzzleDimension, target - minPuzzleDimension);
        const cols = target - rows;

        return {rows: rows, cols: cols};
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
        if (this.state.usingUserImage && (!this.userImage || this.state.invalidUserImage)) {
            return;
        }

        const rows = this.validateDimension(this.state.rows);
        const cols = this.validateDimension(this.state.cols);

        const img = this.selectedImage;
        document.documentElement.style.setProperty('--puzzle-img', `url(${img.url})`);
        
        const sizeTester = new Image();
        sizeTester.onerror = () => console.log("Failed to load image");
        sizeTester.onload = () => this.props.newPuzzle(sizeTester.naturalWidth, sizeTester.naturalHeight, rows, cols, img);
        sizeTester.src = img.url;
    };

    renderSelectOptions() {
        const options = [];
        for (let i = 0; i < presetImages.length; i++) {
            const img = presetImages[i];
            options.push(<option key={i} value={img.url}>{img.shortName}</option>);
        }
        return options;
    }

    render() {
        const rowsVal = isNaN(this.state.rows) ? '' : this.state.rows;
        const colsVal = isNaN(this.state.cols) ? '' : this.state.cols;

        const presetBtnStyle = this.state.usingUserImage ? 'btn-outline-dark' : 'btn-dark';
        const userBtnStyle = this.state.usingUserImage ? 'btn-dark' : 'btn-outline-dark';

        return (
            <form className='container mt-4'>
                <div className='form-group row'>
                    <div className='input-group'>
                        <div className='input-group-prepend col-12 col-lg-6 pr-lg-0'>
                            <div className={`btn ${presetBtnStyle} d-flex flex-wrap flex-sm-nowrap align-items-center w-100`} onClick={this.usePresetImage}>
                                <input readOnly className='col-auto' id='radioBtn1' type='radio'
                                    checked={!this.state.usingUserImage} onKeyDown={this.handleRadioKeyDown}/>
                                <label className='col col-sm-4 col-md-3 col-lg-auto col-form-label' htmlFor='radioBtn1'>Choose an image:</label>
                                <div className='w-100 d-sm-none'></div>
                                <label className='sr-only' htmlFor='puzzle-image-select'>Select image</label>
                                <select className='custom-select col mr-lg-4' id='puzzle-image-select' onChange={this.handleSelectChange}>
                                    {this.renderSelectOptions()}
                                </select>
                            </div>
                        </div>

                            
                        <div className='input-group-append col-12 col-lg-6 pl-lg-0'>
                            <div className={`btn ${userBtnStyle} d-flex flex-wrap flex-sm-nowrap align-items-center w-100`} onClick={this.useUserImage}>
                                <input readOnly className='col-auto order-first order-lg-last ml-lg-3' id='radioBtn2' type='radio'
                                    checked={this.state.usingUserImage} onKeyDown={this.handleRadioKeyDown}/>
                                <label className='col col-sm-4 col-md-3 col-lg-auto col-form-label' htmlFor='radioBtn2'>Or use your own:</label>
                                <div className='w-100 d-sm-none'></div>
                                <CustomInput className='col text-left' id='file-input' type='file' accept='image/*' innerRef={this.fileInput}
                                    invalid={this.state.invalidUserImage} onChange={this.handleFileChange}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='form-group row justify-content-center'>
                    <label className='mr-2 my-2 col-form-label' htmlFor='row-input'>Rows:</label>
                    <input className='mr-2 my-2' id={'row-input'} type='number' min={minPuzzleDimension} max={maxPuzzleDimension}
                        name='rows' value={rowsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    
                    <label className='mr-2 my-2 col-form-label' htmlFor='col-input'>Columns:</label>
                    <input className='mr-4 my-2' id='col-input' type='number' min={minPuzzleDimension} max={maxPuzzleDimension} 
                        name='cols' value={colsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                    
                    <button className='btn btn-dark btn-lg' type='button' disabled={this.state.usingUserImage && this.state.invalidUserImage} onClick={this.newPuzzle}>New puzzle</button>
                </div>
            </form>
        );
    }
}