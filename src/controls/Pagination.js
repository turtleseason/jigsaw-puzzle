import { Component } from 'react';
import PropTypes from 'prop-types';


export default class Pagination extends Component {
    handleNavigate(e, newPage) {
        e.preventDefault();
        if (this.props.onPageChange) {
            this.props.onPageChange(newPage);
        }
    }

    renderPageLinks() {
        const links = [];

        const start = this.props.currentPage - this.props.numPageLinks - 1;
        const end = this.props.currentPage + this.props.numPageLinks + 1;

        if (start >= this.props.minPage) {
            links.push(<li key={start}><span className='btn' style={{ cursor: 'default' }}>...</span></li>);
        } else {
            links.push(<li key={start} className='invisible'></li>);
        }

        for (let i = start + 1; i < end; i++) {
            let content = null;
            if (i === this.props.currentPage) {
                content = <span className='btn' style={{ cursor: 'default' }}>{i}</span>;
            }
            else if (i >= this.props.minPage && i <= this.props.maxPage) {
                content = <button className='btn btn-link' type='button' onClick={(e) => this.handleNavigate(e, i)}>{i}</button>;
            }
            links.push(<li className={!content ? 'invisible' : null} key={i}>{content}</li>);
        }

        if (end <= this.props.maxPage) {
            links.push(<li key={end}><span className='btn' style={{ cursor: 'default' }}>...</span></li>);
        } else {
            links.push(<li key={end} className='invisible'></li>);
        }

        return <ul>{links}</ul>;
    }

    render() {
        const { currentPage, minPage, maxPage, numPageLinks, onPageChange, className, ariaLabel, ...customAttributes } = this.props;

        const outerClassName = 'custom-pagination container ' + (className || '');
        const outerAriaLabel = ariaLabel || 'Search results pages';

        const isFirst = !(this.props.currentPage > this.props.minPage);
        const isLast = !(this.props.currentPage < this.props.maxPage);

        const pageLinks = this.renderPageLinks();

        return (
            <nav className={outerClassName} aria-label={outerAriaLabel} {...customAttributes}>
                <div className='row justify-content-between align-items-center'>
                    <div className='col-auto p-0'>
                        <button className={'btn btn-link' + (isFirst ? ' invisible' : '')} type='button'
                            onClick={isFirst ? null : (e) => this.handleNavigate(e, this.props.currentPage - 1)}>
                            {'< Back'}
                        </button>
                    </div>

                    <div className='col-auto'>
                        {pageLinks}
                    </div>

                    <div className='col-auto p-0'>
                        <button className={'btn btn-link' + (isLast ? ' invisible' : '')} type='button'
                            onClick={isLast ? null : (e) => this.handleNavigate(e, this.props.currentPage + 1)}>
                            {'More >'}
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
}

// In addition to the listed types, any unrecognized props will be added as attributes to the outer <nav> DOM node,
// to allow for customization
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    minPage: PropTypes.number,
    maxPage: PropTypes.number,
    numPageLinks: PropTypes.number,  // The number of page links shown on either side of the current page number
    onPageChange: PropTypes.func,    // Callback raised when a page link is clicked; it is given one parameter, the page number to navigate to
    className: PropTypes.string,     // An optional class string to append to the default classes
    ariaLabel: PropTypes.string,     // An optional label string to replace the default aria-label
};

Pagination.defaultProps = {
    minPage: 1,
    maxPage: Number.MAX_SAFE_INTEGER,
    numPageLinks: 1,
};