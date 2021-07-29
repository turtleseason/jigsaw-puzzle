import { Component } from 'react';


export default class PuzzleCompleteImage extends Component {
    constructor(props) {
        super(props);
        this.state = {...this.props.startPos};
    }

    componentDidMount() {
        // Change on the second frame to ensure the image is drawn at the original position at least once.
        requestAnimationFrame(() => requestAnimationFrame(() => this.setState({...this.props.destPos})));
    }

    render() {
        return (
            <img className='puzzle-complete-img'
                 src={this.props.imgUrl}
                 alt='Completed puzzle'
                 width={this.props.width}
                 height={this.props.height}
                 style={{left: this.state.left, top: this.state.top}}
                 onTransitionEnd={this.props.onTransitionEnd}/>
        ); 
    }
}