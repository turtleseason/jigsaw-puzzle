import { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { isEmptyOrWhitespace } from '../util.js'
import { ImageInfo, ImageSource } from './ImageInfo.js';
import ImageSearchModalErrorMessage, { ErrorInfo } from './ImageSearchModalErrorMessage.js';
import ImageSearchModalResults from './ImageSearchModalResults.js';

import './ImageSearchModal.css';


export default class ImageSearchModal extends Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);
        this.searchImages = this.searchImages.bind(this);

        this.proxyUrl = process.env.REACT_APP_PROXY_URL;

        this.state = {
            images: [],
            page: -1,
            searchString: '',
            isSearchStringValid: true,
            isSearchLoading: false,
            error: null,
            selectedImage: null
        }
    }

    handleInputChange(e) {
        this.setState({searchString: e.target.value});
    }

    handleInputKeyDown(e) {
        if (e.key === 'Enter') {
            this.searchImages();
            e.preventDefault();
        }
    }

    selectImage(image) {
        this.setState({selectedImage: image});
    }

    handleChooseButtonClick() {
        this.chooseImage();
        this.props.toggleModal();
    }

    getSearchUrl(query) {
        return `${this.proxyUrl}/search/${encodeURIComponent(query)}`;
    }

    getDownloadUrl(photoId) {
        return `${this.proxyUrl}/download/${photoId}`;
    }

    addImages(newImages) {
        const images = this.state.images.slice();
        images.push(newImages);
        this.setState((state) => {return {images: images, page: state.page + 1}});
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
        this.setState({isSearchStringValid: isValid});
        return isValid;
    }

    searchImages() {
        const query = this.state.searchString;
        if (!this.validateQuery(query)) {
            return;
        }
        
        // console.log('Searching: ' + query);
        this.setState({isSearchLoading: true});

        fetch(this.getSearchUrl(query)).then(response => {
            if (!response.ok) {
                console.warn(`Response returned with error: ${response.status}, ${response.statusText}`);
                this.setState({error: new ErrorInfo('proxy', response.status, response.statusText)});
                throw new Error(`Failed response: ${response.status}, ${response.statusText}`);
            }
            return response.json();
        }).then(upstreamResponse => {
            // console.log(upstreamResponse);

            if (upstreamResponse.errors) {
                console.warn(`The upstream server returned an error (status code ${upstreamResponse.status}):
                    ${upstreamResponse.errors.join(', ')}`);
                this.setState({error: new ErrorInfo('upstream', upstreamResponse.status, upstreamResponse.errors.join(', '))});
                throw new Error(`Upstream failed response (status code ${upstreamResponse.status}):
                    ${upstreamResponse.errors.join(', ')}`);
            }

            this.setState({error: null});
            this.addImages(upstreamResponse.response.results);
        }).catch(err => {
            if (err instanceof TypeError) {
                this.setState({error: new ErrorInfo('network')});
            }
            console.warn(`${err.name}: ${err.message}`);
        }).finally(() => {
            this.setState({isSearchLoading: false})
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
        return (
            <Modal toggle={this.props.toggleModal} isOpen={this.props.isOpen} scrollable={true} size='lg' centered={true}>
                <ModalHeader toggle={this.props.toggleModal}>Find images</ModalHeader>
                <ModalBody>
                    <p>Browse images from Unsplash.com by searching below.</p>
                    <div className={`form-group row mx-0`}>
                        <label className='col-form-label mr-2' htmlFor='img-search-input'>Search by keyword</label>
                        <input className={`col col-lg-4 form-control ${!this.state.isSearchStringValid? 'is-invalid' : ''} px-2 mr-2`}
                            id='img-search-input' type='text' value={this.state.searchString} aria-describedby='searchValidationFeedback'
                            onKeyDown={this.handleInputKeyDown} onChange={this.handleInputChange}/>
                        <button className='btn btn-dark mr-auto' type='button' onClick={this.searchImages}>Go</button>
                        <div className='w-100 d-lg-none'></div>
                        <div className='col invalid-feedback align-self-center' id='searchValidationFeedback'>
                            Please enter a search term.
                        </div>
                    </div>

                    <ImageSearchModalErrorMessage error={this.state.error}/>

                    <ImageSearchModalResults images={this.state.images} page={this.state.page} isLoading={this.state.isSearchLoading}
                        selectedImage={this.state.selectedImage} chooseImage={this.selectImage} />
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-dark' type='button' disabled={!this.state.selectedImage}
                        onClick={this.handleChooseButtonClick}>
                        Use selected image
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}