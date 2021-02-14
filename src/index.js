import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle';
import PuzzleControls from './PuzzleControls';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


let puzzleKey = 1;

function renderPuzzle(width, height, rows, columns) {
    ReactDOM.render(
        <React.StrictMode>
            <PuzzleControls newPuzzle={renderPuzzle} />
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
