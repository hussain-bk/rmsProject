// Created by Hussain Bk
// (hussain.bk@outlook.com)
// 17 March 2020

import React from 'react';
import App from './App';
import "./App.scss"
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
)
