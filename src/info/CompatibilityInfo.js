import { Component } from 'react';
import CompatibilityInfoModal from './CompatibilityInfoModal.js';


export default class CompatibilityInfo extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {modalOpen: false};
    }

    toggleModal() {
        this.setState({modalOpen: !this.state.modalOpen});
    }

    render() {
        return (
            <>
                <button className='btn btn-link text-light' type='button' onClick={this.toggleModal}>
                    <i className='bi bi-list-check text-light mr-2'></i>
                    <small className='align-text-top'>Browser support</small>
                </button>
                <CompatibilityInfoModal toggle={this.toggleModal} isOpen={this.state.modalOpen} />
            </>
        );
    }
}