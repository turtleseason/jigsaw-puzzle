import React, { Component } from 'react';
import { CustomInput } from 'reactstrap';

import { ImageInfo } from './ImageInfo';
import { clamp } from '../util';
import presetImages from './providedImages';


export default class ImagePicker extends Component {
    constructor(props) {
        super(props);

        this.fileInput = React.createRef();

        this.selectedPreset = presetImages[0];
        this.userImage = null;

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleRadioKeyDown = this.handleRadioKeyDown.bind(this);
        this.useUserImage = this.useUserImage.bind(this);
        this.usePresetImage = this.usePresetImage.bind(this);

        this.state = {
            usingUserImage: false,
            invalidUserImage: false
        };
    }
    
    usePresetImage() {
        this.setState({usingUserImage: false});
        this.props.setSelectedImage(this.selectedPreset);
    }

    useUserImage() {
        this.setState({usingUserImage: true});
        this.props.setSelectedImage(this.userImage);
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
            this.selectedPreset = presetImages[select.selectedIndex];
            this.props.setSelectedImage(this.selectedPreset);            
        }
    }

    handleFileChange() {
        this.useUserImage();
        
        const file = this.fileInput.current.files[0];
        const fileUrl = URL.createObjectURL(file);
        
        const testLoader = new Image();
        testLoader.onerror = () => {
            URL.revokeObjectURL(fileUrl);
            if (this.userImage) {
                URL.revokeObjectURL(this.userImage.url);
            }
            this.userImage = null;            
            this.setState({invalidUserImage: true});
            this.props.setSelectedImage(null);
        };
        testLoader.onload = () => {
            if (this.userImage) {
                URL.revokeObjectURL(this.userImage.url);
            }
            const dim = this.generateDefaultDimensions(testLoader.naturalWidth, testLoader.naturalHeight);
            this.userImage = new ImageInfo(file.name, fileUrl, dim.rows, dim.cols);
            this.setState({invalidUserImage: false});
            this.props.setSelectedImage(this.userImage);
        };
        testLoader.src = fileUrl;
    }

    // Tries to choose a good default based on the image aspect ratio;
    // could go further and tailor the target rows+columns to the viewport size
    generateDefaultDimensions(width, height) {
        const target = 15;
        const minBound = this.props.minPuzzleDimension;
        const aspect = width / height;

        // cols = (width / height) * rows
        // cols + rows = target
        const rows = clamp(Math.round(target / (aspect + 1)), minBound, target - minBound);
        const cols = target - rows;

        return {rows: rows, cols: cols};
    }

    renderSelectOptions() {
        const options = [];
        for (let i = 0; i < presetImages.length; i++) {
            const img = presetImages[i];
            options.push(<option key={i} value={img.url}>{img.shortName}</option>);
        }
        return options;
    }

    render() {
        const presetBtnStyle = this.state.usingUserImage ? 'btn-outline-dark' : 'btn-dark';
        const userBtnStyle = this.state.usingUserImage ? 'btn-dark' : 'btn-outline-dark';

        return (
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
        );
    }
}