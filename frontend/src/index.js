import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import {composeWithDevTools} from 'redux-devtools-extension';
// #region Redux code

import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducer from "./reducer/reducer"

const store = createStore(reducer, composeWithDevTools());
//#endregion

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const options = {
  timeout: 2000,
  position: positions.TOP_CENTER,
};

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    
      <AuthProvider>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </AuthProvider>
    
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
