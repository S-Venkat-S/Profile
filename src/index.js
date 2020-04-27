import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Sudoku from "./sudoku/index.js"
import * as serviceWorker from './serviceWorker';

const path = window.location.pathname
let Page = null
if (path === "/sudoku") {
  Page = Sudoku
}
else {
  Page = App
}

ReactDOM.render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
