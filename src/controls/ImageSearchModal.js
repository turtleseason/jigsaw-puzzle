import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { clamp, isEmptyOrWhitespace } from '../util.js';
import { ImageInfo, ImageSource } from './ImageInfo.js';
import ImageSearchModalErrorMessage, { ErrorInfo } from './ImageSearchModalErrorMessage.js';
import ImageSearchModalResults from './ImageSearchModalResults.js';
import Pagination from './Pagination.js';

import './ImageSearchModal.css';


const MAX_SEARCH_PAGES = 10;

export default class ImageSearchModal extends Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);
        this.selectImage = this.selectImage.bind(this);

        this.proxyUrl = process.env.REACT_APP_PROXY_URL;

        this.searchBoxRef = React.createRef();

        // Note: The page count starts from 1, but the images array is zero-indexed,
        // so make sure to subtract 1 when using this.state.page to accesss the images array.
        this.state = {
            images: [],
            page: 1,
            maxPage: 1,
            searchString: '',
            isSearchStringValid: true,
            isSearchLoading: false,
            error: null,
            selectedImage: null
        };
    }

    handleInputChange(e) {
        this.setState({ searchString: e.target.value });
    }

    handleInputKeyDown(e) {
        if (e.key === 'Enter') {
            this.handleSearchButtonClick();
            e.preventDefault();
        }
    }

    handlePageChange(newPage) {
        if (this.state.isSearchLoading) {
            return;
        }

        newPage = Math.floor(newPage);
        newPage = clamp(newPage, 1, MAX_SEARCH_PAGES);

        // Supposedly scrollIntoView() doesn't work with CSS 'scroll-behavior: smooth' on Chrome/Edge,
        // but in manual testing it seems to be working?
        requestAnimationFrame(() => this.searchBoxRef.current.scrollIntoView());

        // (Could use scrollTo() or scrollTop as an alternative:)
        // requestAnimationFrame(() => this.modalRef.current.querySelector('.modal-body').scrollTo(0, 0));
        // requestAnimationFrame(() => this.modalRef.current.querySelector('.modal-body').scrollTop = 0);

        if (!this.state.images[newPage - 1]) {
            this.searchImages(newPage);
        } else {
            this.setState({ page: newPage });
        }
    }

    handleSearchButtonClick() {
        this.setState({ images: [] }, () => this.searchImages(1));
    }

    handleChooseButtonClick() {
        this.chooseImage();
        this.props.toggleModal();
    }

    selectImage(image) {
        this.setState({ selectedImage: image });
    }

    getSearchUrl(query, page) {
        return `${this.proxyUrl}/search/${encodeURIComponent(query)}/page/${page}`;
    }

    getDownloadUrl(photoId) {
        return `${this.proxyUrl}/download/${photoId}`;
    }

    addImages(newImages, page, totalPages) {
        const images = this.state.images.slice();
        images[page - 1] = newImages;

        const maxPage = Math.min(totalPages, MAX_SEARCH_PAGES);

        this.setState({ images: images, page: page, maxPage: maxPage });
    }

    chooseImage() {
        const img = this.state.selectedImage;

        // Note: This passes in the raw image dimensions, while the used image is likely to be smaller (1080px) -
        // which is fine as long as generateDefaultDimensions only uses the aspect ratio, but that could change in the future.
        const dim = this.props.generateDefaultDimensions(img.width, img.height);

        this.props.setImage(new ImageInfo(`Unsplash Photo (${img.id})`, img.urls.regular, dim.rows, dim.cols, img.user.name,
            new ImageSource('Unsplash', false, true, img.links.html)));

        this.trackDownload(img.id);
    }

    validateQuery(query) {
        const isValid = query && !isEmptyOrWhitespace(query);
        this.setState({ isSearchStringValid: isValid });
        return isValid;
    }

    searchImages(page) {
        const query = this.state.searchString;
        if (!this.validateQuery(query)) {
            return;
        }

        // console.log('Searching: ' + query);
        this.setState({ isSearchLoading: true });

        fetch(this.getSearchUrl(query, page)).then(response => {
            if (!response.ok) {
                console.warn(`Proxy server returned an error: ${response.status}, ${response.statusText}`);
                this.setState({ error: new ErrorInfo('proxy', response.status, response.statusText) });
                throw new Error(`Failed response: ${response.status}, ${response.statusText}`);
            }
            return response.json();
        }).then(upstreamResponse => {
            // console.log(upstreamResponse);

            if (upstreamResponse.errors) {
                console.warn(`Upstream server returned an error (status code ${upstreamResponse.status}):
                    ${upstreamResponse.errors.join(', ')}`);
                this.setState({ error: new ErrorInfo('upstream', upstreamResponse.status, upstreamResponse.errors.join(', ')) });
                throw new Error(`Upstream failed response (status code ${upstreamResponse.status}):
                    ${upstreamResponse.errors.join(', ')}`);
            }

            this.setState({ error: null });
            this.addImages(upstreamResponse.response.results, page, upstreamResponse.response.total_pages);
        }).catch(err => {
            if (err instanceof TypeError) {
                this.setState({ error: new ErrorInfo('network') });
            }
            console.warn(`${err.name}: ${err.message}`);
        }).finally(() => {
            this.setState({ isSearchLoading: false });
        });
    }

    trackDownload(photoId) {
        fetch(this.getDownloadUrl(photoId)).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }).then(upstreamResponse => {
            if (upstreamResponse.type === 'success') {
                // console.log(`Image ${photoId} download notified successfully.`);
                // console.log(upstreamResponse)
            } else {
                throw new Error(`${upstreamResponse.status} - ${upstreamResponse.errors.join(', ')} (upstream)`);
            }
        }).catch(err =>
            console.warn(`Image ${photoId} download failed. Error:`, err.message)
        );
    }

    render() {
        const hasResults = this.state.images[this.state.page - 1] && this.state.images[this.state.page - 1].length > 0;
        return (
            <Modal toggle={this.props.toggleModal} isOpen={this.props.isOpen} scrollable={true} size='lg' centered={true}>
                <ModalHeader toggle={this.props.toggleModal}>Find images</ModalHeader>

                <ModalBody>
                    <p>Browse images from Unsplash.com by searching below.</p>

                    <div className={`form-group row mx-0`} ref={this.searchBoxRef}>
                        <label className='col-form-label mr-2' htmlFor='img-search-input'>Search by keyword</label>
                        <input className={`col col-lg-4 form-control ${!this.state.isSearchStringValid ? 'is-invalid' : ''} px-2 mr-2`}
                            id='img-search-input' type='text' value={this.state.searchString} aria-describedby='searchValidationFeedback'
                            onKeyDown={this.handleInputKeyDown} onChange={this.handleInputChange} />
                        <button className='btn btn-dark mr-auto' type='button' onClick={this.handleSearchButtonClick}>Search</button>
                        <div className='w-100 d-lg-none'></div>
                        <div className='col invalid-feedback align-self-center' id='searchValidationFeedback'>
                            Please enter a search term.
                        </div>
                    </div>

                    <ImageSearchModalErrorMessage error={this.state.error} />

                    <ImageSearchModalResults images={this.state.images} page={this.state.page - 1} isLoading={this.state.isSearchLoading}
                        selectedImage={this.state.selectedImage} chooseImage={this.selectImage} />
                </ModalBody>

                <ModalFooter className='flex-sm-nowrap'>
                    {hasResults ?
                        <Pagination className='mr-sm-3'
                            currentPage={this.state.page}
                            maxPage={this.state.maxPage}
                            onPageChange={this.handlePageChange} />
                        : null}

                    <button className='btn btn-dark flex-shrink-0' type='button' disabled={!this.state.selectedImage}
                        onClick={this.handleChooseButtonClick}>
                        Use selected image
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

ImageSearchModal.propTypes = {
    // The ImageSearchModal will call this with a new ImageInfo object when the user selects an image to use from the search.
    setImage: PropTypes.func.isRequired,
    // Calculates default puzzle dimensions (rows+columns) from an image's width and height.
    generateDefaultDimensions: PropTypes.func.isRequired,
    // A function the modal can call to close itself.
    toggleModal: PropTypes.func.isRequired,
    // Whether the modal should be shown.
    isOpen: PropTypes.bool.isRequired,
};