// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Optional: import global styles
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// In app.js or index.js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
