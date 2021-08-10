import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';
import CompatibilityInfo from './info/CompatibilityInfo.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('react-root')
);

ReactDOM.render(
    <React.StrictMode>
        <CompatibilityInfo />
    </React.StrictMode>,
    document.getElementById('compatibility-info-root')
);