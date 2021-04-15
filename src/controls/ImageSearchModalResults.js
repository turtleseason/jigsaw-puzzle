import { Component } from 'react';
import PropTypes from 'prop-types';


export default class ImageSearchModalResults extends Component {
    handleImageClick(index) {
        this.props.chooseImage(this.props.images[this.props.page][index]);
    }

    handleKeyDown(index, e) {
        if ((e.key === 'Enter' || e.key === 'Space') && e.target.tagName !== 'A') {
            this.props.chooseImage(this.props.images[this.props.page][index]);
            e.preventDefault();
        }
    }

    // TODO: redo with better semantic markup
    renderImage(img, index) {
        const isSelected = this.props.selectedImage === img;
        return(
            <div data-testid='result' className={'result-container mb-2'} key={img.id} tabIndex='0'
                onClick={() => this.handleImageClick(index)} onKeyDown={(e) => this.handleKeyDown(index, e)}>
                <div className={`result ${isSelected ? 'result-selected' : ''}`}>
                    <div className='placeholder' style={{paddingTop: (img.height / img.width) * 100 + '%'}}>
                        <img src={img.urls.small} alt={img.alt_description}/>
                        <span className='badge badge-dark'>
                            By <a className='text-light' href={img.user.links.html} rel='external' target='_blank'>{img.user.name}</a>
                            {' '}on <a className='text-light' href={img.links.html} rel='external' target='_blank'>Unsplash</a>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const images = this.props.images[this.props.page];

        const initialText = <div className='text-secondary'>Image results will go here, and it will be very cool.</div>;
        const noResultsText = <div className='text-secondary'>No results found. :(</div>;
        const spinner = (
                <div className='spinner-border my-1' role='status'>
                    <span className='sr-only'>Loading...</span>
                </div>);

        return (
            <div className='search-results-container text-center'>
                {!this.props.isLoading && !images ? initialText : null}
                {!this.props.isLoading && images && images.length === 0 ? noResultsText : null}
                {this.props.isLoading ? spinner : null}
                <div className='search-results'>
                    {images ? images.map((img, index) => this.renderImage(img, index)) : null}
                </div>
            </div>
        );
    }
}

ImageSearchModalResults.propTypes = {
    images: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    page: PropTypes.number,
    isLoading: PropTypes.bool,
    selectedImage: PropTypes.object,
    chooseImage: PropTypes.func,
}