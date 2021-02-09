import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './Puzzle';


ReactDOM.render(
  <React.StrictMode>
    <Puzzle imgWidth={1221} imgHeight={823} borderSize={30} offset={10} rows={7} cols={10} />
  </React.StrictMode>,
  document.getElementById('puzzle_container')
);