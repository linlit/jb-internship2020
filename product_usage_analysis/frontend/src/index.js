import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import productsReducer from './reducers'
import App from './App';

const loggerMiddleware = createLogger();

const store = createStore(
  productsReducer, 
  applyMiddleware(
    thunkMiddleware, 
    loggerMiddleware
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);