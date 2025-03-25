import React from "react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./route/routes";

function App() {
  return (
    <React.StrictMode>
      <AppRoutes />
      <ToastContainer />
    </React.StrictMode>
  );
}

export default App;
