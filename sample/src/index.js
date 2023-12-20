import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Login/login';
// import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import WebSocketComponent from './components/WebSocketComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<WebSocketComponent/>
    {/* <Login /> */}
    {/* <Dashboard/> */}
    {/* <Navbar/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
