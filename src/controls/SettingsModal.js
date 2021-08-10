import { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Input } from 'reactstrap';

export default class SettingsModal extends Component {
    state = {
        color: null,
        saveComplete: false,
    };

    componentDidMount() {
        const color = document.documentElement.style.getPropertyValue('--puzzle-bg');
        this.setState({ color: color !== '' ? color : '#adb5bd' });
    }

    handleOpened = () => {
        this.setState({ saveComplete: false });
    };

    handleDimensionsChange = (e) => {
        this.props.setDimension(e.target.name, e.target.valueAsNumber);
    };

    handleDimensionsBlur = (e) => {
        this.props.setDimension(e.target.name, this.validateDimension(e.target.value));
    };

    handleColorChange = (e) => {
        const color = e.target.value;
        this.setState({ color: color });
        document.documentElement.style.setProperty('--puzzle-bg', color);
    };

    handleSave = async () => {
        this.setState({ saveComplete: false });
        const success = await this.props.saveGame();
        this.setState({ saveComplete: success });
    };

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
            <Modal toggle={this.props.toggleModal} isOpen={this.props.isOpen} onOpened={this.handleOpened} centered={true}>
                <ModalHeader toggle={this.props.toggleModal}>Settings</ModalHeader>
                <ModalBody>
                    <form className='container'>
                        <div className='row mb-2'>
                            <span>Options</span>
                        </div>

                        <div className='form-group row mb-4 pl-3'>
                            <label className='col-form-label mr-2 my-2' htmlFor='row-input'>Rows:</label>
                            <input className='mr-2 my-2' id='row-input' type='number' min={this.props.minPuzzleDimension} max={this.props.maxPuzzleDimension}
                                name='rows' value={rowsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur} />

                            <label className='col-form-label mr-2 my-2' htmlFor='col-input'>Columns:</label>
                            <input className='mr-2 my-2' id='col-input' type='number' min={this.props.minPuzzleDimension} max={this.props.maxPuzzleDimension}
                                name='cols' value={colsVal} onChange={this.handleDimensionsChange} onBlur={this.handleDimensionsBlur} />

                            <small className='col-12 col-sm pl-0 pl-sm-3 text-muted'>
                                Changes to rows and columns take effect the next time you start a new puzzle.
                            </small>
                        </div>

                        <div className='form-group row mb-4 pl-3'>
                            <label className='col-auto col-form-label pl-0' htmlFor='color-input'>Background color:</label>
                            <Input className='col' id='color-input' type='color' value={this.state.color} onChange={this.handleColorChange} />
                        </div>

                        <div className='row mb-2'>
                            <span className='col-auto col-form-label pl-0'>Save</span>
                        </div>

                        <div className='form-group row mb-4 px-3 align-items-center'>
                            <button className='btn btn-dark col col-sm-auto mb-2 mb-sm-0' type='button' onClick={this.handleSave}>
                                Save now
                            </button>

                            <small className='col-12 col-sm pl-0 pl-sm-3 text-muted'>
                                Data is saved locally in your browser. It will be deleted if you clear your browser's local storage for this site.
                            </small>

                            {this.state.saveComplete &&
                                <small className='col-12 text-success text-right'>
                                    Saved <i className='bi bi-check'></i>
                                </small>
                            }
                        </div>

                        <div className='form-group row mb-4 px-3 align-items-center'>
                            <button className='btn btn-outline-dark col col-sm-auto mb-2 mb-sm-0' type='button' onClick={this.props.loadGame}>
                                Load last saved puzzle
                            </button>
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