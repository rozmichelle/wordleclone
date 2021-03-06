// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
import React from 'react';
import ReactDOM from 'react-dom';
import './css/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  //<React.StrictMode> // disabling because it rerenders state which changes solution word
    <App />,
  //</React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
