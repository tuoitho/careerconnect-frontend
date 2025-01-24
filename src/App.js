import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterLayout from './components/recruiter/RecruiterLayout';
import Layout from './components/Layout';
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";
import Unauthorized from './pages/Unauthorized';
import RecruiterHome from './pages/RecruiterHome';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Registration />} />
            
            {/* Recruiter Routes */}
            <Route path="/recruiter/*" element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterLayout>
                  <Routes>
                    <Route path="/" element={<RecruiterHome />} />
                    {/* <Route path="dashboard" element={<RecruiterDashboard />} />
                    <Route path="jobs" element={<JobPostingSection />} /> */}
                    {/* Add more recruiter routes */}

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RecruiterLayout>
              </ProtectedRoute>
            } />
            {/* <Route path="/404" element={<NotFound />} /> */}

            {/* User Routes */}
            <Route path="/*" element={
              <ProtectedRoute allowedRoles={['user']}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                    {/* Add more user routes */}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<Unauthorized/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
