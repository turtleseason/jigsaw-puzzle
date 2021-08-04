import { Component } from 'react';
import PropTypes from 'prop-types';

export class ErrorInfo {
    constructor(type, statusCode, details) {
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export default class ImageSearchModalErrorMessage extends Component {
    getErrorDisplay() {
        const err = this.props.error;
        if (err.statusCode === 429 && err.type === 'upstream') {
            return {
                title: 'Rate limit exceeded (API)',
                text: (<>
                    <p>The hourly limit for requests from this site to the Unsplash server has been reached.</p>
                    <p>Feel free to <a className='alert-link' href='https://github.com/turtleseason/jigsaw-puzzle/issues' rel='external'>open an issue on GitHub</a>
                        {' '}to let me know - <br />if this happens often, I can look into applying for a higher rate limit.</p>
                </>)
            };
        } else if (err.statusCode === 429 && err.type === 'proxy') {
            return {
                title: 'Rate limit exceeded (API Proxy)',
                text: (<p>Please try again in a moment.<br />(If you get this error frequently, feel free to {' '}
                    <a className='alert-link' href='https://github.com/turtleseason/jigsaw-puzzle/issues' rel='external'>open an issue on GitHub</a>
                    {' '}and let me know.)</p>)
            };
        } else {
            const errInfo = err.type === 'network' ? 'Network error' : `Status code ${err.statusCode} (${err.type})`;
            const errDetails = err.details ? ' - ' + err.details : null;
            return {
                title: 'Something went wrong :0',
                text: (<>
                    <p><small className=''>Error details: {errInfo}{errDetails}</small></p>
                    <p>Please try again. If you keep getting an error, feel free to {' '}
                        <a className='alert-link' href='https://github.com/turtleseason/jigsaw-puzzle/issues' rel='external'>open an issue on GitHub</a>
                        {' '}and let me know.</p>
                </>)
            };
        }
    }

    render() {
        if (!this.props.error) {
            return null;
        }

        const errDisplay = this.getErrorDisplay();
        return (
            <div className='search-error alert alert-warning text-center' role='alert'>
                <h6 className='alert-heading'>{errDisplay.title}</h6>
                {errDisplay.text}
                <p className='mt-n2'>
                    You can still search photos directly on <a href='https://unsplash.com/' target='_blank' rel='external noreferrer'>Unsplash.com</a>,
                    {' '}download an image to your computer, and load it using the file selector.
                </p>
            </div>
        );
    }
}

ImageSearchModalErrorMessage.propTypes = {
    error: PropTypes.instanceOf(ErrorInfo),
};