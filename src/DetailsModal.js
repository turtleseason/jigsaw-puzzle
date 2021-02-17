import { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';


export default class DetailsModal extends Component {
    render() {
        const image = this.props.image;
        
        let body = '';
        if (image && image.source) {
                const credit = (image.source.nameIsTitle ? image.name : 'Photo') + ' by ' + image.author;
                body = ( 
                    <ModalBody>
                        <Row>
                            <Col md='8'><img src={image.url} width='100%'/></Col>
                            <Col md='4' className='mt-3 mt-md-0 pl-md-0'>
                                <p>{credit}</p>
                                <p>Source: {image.source.sourceName}</p>
                            </Col>
                        </Row>
                        <Row className='mt-md-3'>
                            <Col>
                                <p>See the original at: <a href={image.source.sourceUrl} target='_blank' rel='external noopener'>{image.source.sourceUrl}</a></p>
                                {image.source.description ? <p>{image.source.description}</p> : null}
                            </Col>
                        </Row>
                    </ModalBody>
                ); 
            }

        return(
            <Modal toggle={this.props.toggleModal} isOpen={this.props.isOpen} centered={true}> 
                <ModalHeader toggle={this.props.toggleModal}>Image details</ModalHeader>
                {body}
            </Modal>
        );  
    }
}