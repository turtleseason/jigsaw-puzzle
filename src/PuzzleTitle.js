import { Component } from 'react';


export default class PuzzleTitle extends Component {
    render() {
        const puzzleImage = this.props.puzzleImage;
        if (!puzzleImage) {
            return null;
        }

        const isPhoto = puzzleImage.source && puzzleImage.source.isPhoto;
        const nameIsTitle = puzzleImage.source && puzzleImage.source.nameIsTitle;

        const title = nameIsTitle ? <em>{puzzleImage.name}</em> : puzzleImage.name;
        const author = puzzleImage.author ? `,${isPhoto ? ' photo' : ''} by ${puzzleImage.author}` : '';
        const info = puzzleImage.source ? <small> <a href='#'>more info</a></small> : '';

        return <h2 className='mt-4 text-center'>{title}{author}{info}</h2>;
    }
}