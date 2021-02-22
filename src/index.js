import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './puzzle/Puzzle.js';
import PuzzleTitle from './title/PuzzleTitle.js';
import PuzzleControls from './controls/PuzzleControls.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


let puzzleKey = 1;

function renderPuzzle(width, height, rows, columns, image) {
    ReactDOM.render(
        <React.StrictMode>
            <PuzzleControls newPuzzle={renderPuzzle} />
            <PuzzleTitle puzzleImage={image} />
            <Puzzle key={++puzzleKey} imgWidth={width} imgHeight={height} rows={rows} cols={columns} />
        </React.StrictMode>,
        document.getElementById('react-root')
    );
}

// Initial render so that PuzzleControls can set up, which then calls renderPuzzle() when loaded (is there a better way to design this?)
ReactDOM.render(
    <React.StrictMode>
        <PuzzleControls newPuzzle={renderPuzzle} />
    </React.StrictMode>,
    document.getElementById('react-root')
);
