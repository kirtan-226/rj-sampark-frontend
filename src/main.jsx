import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import App from "./App";
import { BACKEND_ENDPOINT } from "./api/api";

// Apply base URL + persisted Basic auth (if available) before rendering.
axios.defaults.baseURL = BACKEND_ENDPOINT;
const savedAuth = localStorage.getItem("authToken");
if (savedAuth) {
  axios.defaults.headers.common.Authorization = `Basic ${savedAuth}`;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
