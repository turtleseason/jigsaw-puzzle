import { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';


export default class CompatibilityInfoModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} centered={true}>
                <ModalHeader toggle={this.props.toggle}>Browser compatibility</ModalHeader>
                <ModalBody>
                    <p>
                        For the best experience, it's recommended to view this website in a recent version of <b>Firefox</b>, <b>Chrome</b>, or <b>Edge</b> on desktop,
                        {' '}or <b>Chrome</b> on mobile.
                    </p>
                    <p>
                        Safari is mostly supported, but there is an issue where the clickable area of each puzzle piece extends past the visible image
                        {' '}(due to the clip-path property not masking the mouse hit area).
                    </p>
                    <p>This site does not work in Internet Explorer.</p>
                </ModalBody>
            </Modal>
        );
    }
}