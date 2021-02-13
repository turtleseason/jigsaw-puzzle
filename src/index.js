import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle';
import PuzzleImage from './PuzzleImage';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const presetImages = [
    new PuzzleImage('Roses', 'images/van-gogh-roses-nga.jpg', 'Vincent van Gogh', 'National Gallery of Art', 8, 10),
    new PuzzleImage('Moonlit field', 'images/luca-huter-vFrhuBvI-hI-unsplash.jpg', 'Luca Huter', 'unsplash', 7, 10),
    new PuzzleImage('Wish', 'images/casey-horner-80UR4DM2Rz0-unsplash.jpg', 'Casey Horner', 'unsplash', 7, 10),
    new PuzzleImage('Coral', 'images/david-clode-eOSqRq2Qm1c-unsplash.jpg', 'David Clode', 'unsplash', 7, 10),
    new PuzzleImage('Jellyfish', 'images/travel-sourced-FsmcD6uKcHk-unsplash.jpg', 'Travel Sourced', 'unsplash', 7, 10),
    new PuzzleImage('Succulents', 'images/scott-webb-lYzgtps0UtQ-unsplash.jpg', 'Scott Webb', 'unsplash', 11, 7),
    new PuzzleImage('freebirb', 'lunar_festival.png', 'Kan Gao', 'twitter', 7, 10),
];


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
    const rowInput = document.getElementById('row-input');
    const colInput = document.getElementById('col-input');
    if (!rowInput.checkValidity() || !colInput.checkValidity()) {
        console.log("validation failed");
        return;
    }
    const rows = parseInt(rowInput.value, 10);
    const cols = parseInt(colInput.value, 10);
    
    const imageUrl = document.getElementById('puzzle-image-select').value;
    document.documentElement.style.setProperty('--puzzle-img', `url(${imageUrl})`);
    
    const sizeTester = new Image();
    sizeTester.onload = () => renderPuzzle(sizeTester.width, sizeTester.height, rows, cols);
    sizeTester.src = imageUrl;
};

function setUpImageSelect() {
    const select = document.getElementById('puzzle-image-select');
    
    select.addEventListener('change', function () {
        if (select.value) {
            const opt = select.options[select.selectedIndex];
            document.getElementById('row-input').value = opt.getAttribute('data-rows');
            document.getElementById('col-input').value = opt.getAttribute('data-cols');
        }
    });
    
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (const image of presetImages) {
        const option = document.createElement('option');
        option.value = image.url;
        option.setAttribute('data-rows', image.defaultRows);  // temp
        option.setAttribute('data-cols', image.defaultCols);  // temp
        option.append(image.name);
        select.append(option);
    }

    document.getElementById('row-input').value = select.options[0].getAttribute('data-rows');
    document.getElementById('col-input').value = select.options[0].getAttribute('data-cols');
}

setUpImageSelect();
document.getElementById('new-puzzle-btn').onclick = newPuzzle;
newPuzzle();