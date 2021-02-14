import { Component } from 'react';


export default class PuzzleTitle extends Component {
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
        const info = puzzleImage.source ? <a className='text-dark' href='#'><small>more info</small></a> : '';

        return (
            <div className='container mt-3'>
                <div className='row justify-content-center mx-n2'>
                    <div className='col-0 col-sm px-2'> </div> 
                    <div className='col-auto px-2'>
                        <h2>{title}{author}</h2>
                    </div>
                    <div className='col-auto col-sm px-2'><h2>{info}</h2></div>
                </div>
            </div>);
    }
}