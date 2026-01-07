import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import App from "./App";
import { BACKEND_ENDPOINT, getAuthToken } from "./api/api";

// Apply base URL + persisted Basic auth (if available) before rendering.
axios.defaults.baseURL = BACKEND_ENDPOINT;
const savedAuth = getAuthToken();
if (savedAuth) {
  axios.defaults.headers.common.Authorization = `Basic ${savedAuth}`;
}

axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Basic ${token}`;
  } else if (config.headers) {
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Authorization");
    } else {
      delete config.headers.Authorization;
    }
  }
  return config;
});

let hasShownSessionAlert = false;

const redirectToLoginIfNeeded = () => {
  if (getAuthToken()) return;
  if (!hasShownSessionAlert) {
    hasShownSessionAlert = true;
    window.alert("Session has expired. Login again.");
  }
  if (window.location.pathname === "/") return;
  window.location.assign("/");
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      redirectToLoginIfNeeded();
    }
    return Promise.reject(error);
  }
);

redirectToLoginIfNeeded();

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
