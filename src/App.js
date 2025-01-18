import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';

function App() {
  return (
    <React.StrictMode>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
    <ToastContainer />

     </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
