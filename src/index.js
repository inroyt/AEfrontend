import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import './input.css';
import App from "./App";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Modal from 'react-modal';
Modal.setAppElement('#root');
//store.dispatch(fetchPosts());
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    <GoogleOAuthProvider 
    clientId="My_ID_"
    onScriptLoadSuccess={() => { console.log('Script loaded successfully'); }}
    onScriptLoadError={() => { console.error('Error loading script'); }}
    >
    <Provider store={store}>
    <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
    </GoogleOAuthProvider>

  
);


