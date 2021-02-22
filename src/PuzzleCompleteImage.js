import { Component } from 'react';

export default class PuzzleCompleteImage extends Component {
    constructor(props) {
        super(props);
        this.state = {...this.props.startPos};
    }

    componentDidMount() {
        requestAnimationFrame(() => this.setState({...this.props.destPos}));
    }

    render() {
        return (
            <div className='puzzle-complete-img' onTransitionEnd={this.props.onTransitionEnd} 
                style={{width: this.props.width, height: this.props.height, left: this.state.left, top: this.state.top}}>
            </div>
        ); 
    }
}