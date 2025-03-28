import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'; // Import Provider
import store from './store/store'; // Import the store
// import { AuthProvider } from "./context/AuthContext"; // Removed AuthProvider import
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}> {/* Wrap with Provider */}
    {/* <AuthProvider> */} {/* Removed AuthProvider wrapper */}
      <App />
    {/* </AuthProvider> */}
  </Provider>
);
