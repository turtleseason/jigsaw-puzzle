import { Component } from 'react';
import DetailsModal from './DetailsModal';


export default class PuzzleTitle extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {modalOpen: false};
    }

    toggleModal() {
        this.setState((state) => { return {modalOpen: !state.modalOpen} });
    }

    render() {
        const puzzleImage = this.props.puzzleImage;
        if (!puzzleImage) {
            return null;
        }

        const isPhoto = puzzleImage.source && puzzleImage.source.isPhoto;
        const nameIsTitle = puzzleImage.source && puzzleImage.source.nameIsTitle;

        const title = nameIsTitle ? <em>{puzzleImage.name}</em> : '';
        let author = '';
        if (puzzleImage.author) {
            if (nameIsTitle) {
                author += `, ${isPhoto ? ' photo' : ''} by `;
            } else if (isPhoto) {
                author += 'Photo by ';
            } else {
                author += 'By '
            }
            author += puzzleImage.author;
        }
        const info = puzzleImage.source ? <button type='button' className='btn btn-link pt-0 pb-0 px-1' onClick={this.toggleModal}>more info</button> : '';

        return (
            <div className='container mt-3'>
                <div className='row justify-content-center mx-n2'>
                    <div className='col-0 col-sm px-2'> </div> 
                    <div className='col-auto px-2'>
                        <p className='h5'>{title}{author}</p>
                    </div>
                    <div className='col-auto col-sm px-2'>{info}</div>
                </div>
                <DetailsModal toggleModal={this.toggleModal} isOpen={this.state.modalOpen} image={puzzleImage} />
            </div>);
    }
}