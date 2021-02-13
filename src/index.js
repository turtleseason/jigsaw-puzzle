import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


let puzzleKey = 1;

function renderPuzzle(width, height, rows, columns) {
    ReactDOM.render(
        <React.StrictMode>
            <Puzzle key={++puzzleKey} imgWidth={width} imgHeight={height} rows={rows} cols={columns} />
        </React.StrictMode>,
        document.getElementById('react-root')
    );
}
    
function newPuzzle() {
    const rows = document.getElementById('row-input').value;
    const columns = document.getElementById('col-input').value;
    const imageUrl = document.getElementById('puzzle-image-select').value;

    document.documentElement.style.setProperty('--puzzle-img', `url(${imageUrl})`);

    const sizeTester = new Image();
    sizeTester.onload = () => renderPuzzle(sizeTester.width, sizeTester.height, parseInt(rows, 10), parseInt(columns, 10));
    sizeTester.src = imageUrl;
};

document.getElementById('new-puzzle-btn').onclick = newPuzzle;
newPuzzle();