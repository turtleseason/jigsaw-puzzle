import { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Input } from 'reactstrap';


export default class SettingsModal extends Component {
    constructor(props) {
        super(props);

        this.handleDimensionsChange = this.handleDimensionsChange.bind(this);
        this.handleDimensionsBlur = this.handleDimensionsBlur.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);

        this.state = {};
    }

    componentDidMount() {
        const color = document.documentElement.style.getPropertyValue('--puzzle-bg');
        this.setState({color: color ? color : '#adb5bd'});
    }

    handleDimensionsChange(e) {
        this.props.setDimension(e.target.name, e.target.valueAsNumber);
    }

    handleDimensionsBlur(e) {
        this.props.setDimension(e.target.name, this.validateDimension(e.target.value));
    }

    handleColorChange(e) {
        const color = e.target.value;
        this.setState({color: color});
        document.documentElement.style.setProperty('--puzzle-bg', color);
    }
    
    validateDimension(val) {
        let result = parseInt(val, 10);
        if (isNaN(result) || result < this.props.minPuzzleDimension) {
            result = this.props.minPuzzleDimension;
        } else if (result > this.props.maxPuzzleDimension) {
            result = this.props.maxPuzzleDimension;
        }
        return result;
    }

    render() {
        const rowsVal = isNaN(this.props.rows) ? '' : this.props.rows;
        const colsVal = isNaN(this.props.cols) ? '' : this.props.cols;

        return (
            <Modal toggle={this.props.toggleModal} isOpen={this.props.isOpen} centered={true}>
                <ModalHeader toggle={this.props.toggleModal}>Settings</ModalHeader>
                <ModalBody>
                    <form className='container'>
                        <div className='form-group row mb-4'>
                            <label className='col-form-label mr-2 my-2' htmlFor='row-input'>Rows:</label>
                            <input className='mr-2 my-2' id='row-input' type='number' min={this.props.minPuzzleDimension} max={this.props.maxPuzzleDimension}
                                name='rows' value={rowsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                            
                            <label className='col-form-label mr-2 my-2' htmlFor='col-input'>Columns:</label>
                            <input className='mr-2 my-2' id='col-input' type='number' min={this.props.minPuzzleDimension} max={this.props.maxPuzzleDimension} 
                                name='cols' value={colsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur}/>
                            
                            <small className='col text-muted'>Changes to rows and columns take effect the next time a new puzzle is started.</small>
                        </div>

                        <div className='form-group row mb-4'>
                            <label className='col-auto col-form-label pl-0' htmlFor='color-input'>Background color:</label>
                            <Input className='col' id='color-input' type='color' value={this.state.color} onChange={this.handleColorChange}/>
                        </div>
                        
                        <div className='form-group row justify-content-end'>
                            <button className='btn btn-dark btn-lg px-4' type='button' onClick={this.props.toggleModal}>Done</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        );
    }
}