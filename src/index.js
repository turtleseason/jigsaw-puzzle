import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle';


let puzzleKey = 1;

function renderPuzzle(width, height) {
    console.log(width + " " + height);
    ReactDOM.render(
        <React.StrictMode>
            <Puzzle key={++puzzleKey} imgWidth={width} imgHeight={height} offset={10} rows={7} cols={10} />
        </React.StrictMode>,
        document.getElementById('react-root')
    );
}
    
function newPuzzle() {
    const imageSelect = document.getElementById('puzzle-image-select');
    const imageUrl = `url(` + imageSelect.value + `)`;
    document.documentElement.style.setProperty('--puzzle-img', imageUrl);
    
    const sizeTester = new Image();
    sizeTester.onload = () => renderPuzzle(sizeTester.width, sizeTester.height)
    sizeTester.src = imageSelect.value;
};

document.getElementById('new-puzzle-btn').onclick = newPuzzle;
newPuzzle();