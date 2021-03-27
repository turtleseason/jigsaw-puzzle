import { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';


export default class CompatibilityInfoModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='lg' centered={true}>
                <ModalHeader toggle={this.props.toggle}>Browser compatibility</ModalHeader>
                <ModalBody>
                    <p>For the best experience, it's recommended to view this website in a recent version of Firefox, Chrome, or Edge on desktop, or Chrome on mobile.</p>
                    <p>The site currently <b>does not work properly</b> in Safari or Internet Explorer.</p>
                </ModalBody>
            </Modal>
        );
    }
}