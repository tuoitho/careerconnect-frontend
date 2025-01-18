import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './App.css';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Profile />} />
      </Routes>
    </Router>
    <ToastContainer />

    </AuthProvider>
  );
}

export default App;
