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
                <i className='bi bi-list-check text-light mr-2'></i>
                <a className='text-light' href='#' onClick={this.toggleModal}>
                    <small className='align-text-top'>Browser support</small>
                </a>
                <CompatibilityInfoModal toggle={this.toggleModal} isOpen={this.state.modalOpen} />
            </>
        );
    }
}