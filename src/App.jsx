import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Removed Routes, Route as they are handled in AppRoutes
// import { AuthProvider } from "./context/AuthContext"; // Removed AuthProvider
import { ToastContainer } from "react-toastify";
import AppRoutes from "./route/routes";
// import Layout from "./components/Layout"; // Likely unused here if AppRoutes handles layout
// import { GoogleOAuthProvider } from "@react-oauth/google"; // Removed, assuming it's handled where needed (e.g., LoginPage)

function App() {
  return (
    // <React.StrictMode> // Keep StrictMode commented out if desired
      <>
      {/* <AuthProvider> */} {/* Removed AuthProvider wrapper */}
        <Router>
            <AppRoutes /> {/* AppRoutes now handles all routing logic */}
          <ToastContainer />
        </Router>
      {/* </AuthProvider> */}
     {/* </React.StrictMode> */}
     </>
  );
}

export default App;
