import React from "react";
import App from "./App";
import ReactDOM from 'react-dom/client'; // For React 18+

import "./index.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <App />
    <ToastContainer/>
  </div>
);
