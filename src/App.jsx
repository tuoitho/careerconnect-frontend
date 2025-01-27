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
import ManageCompany from "./pages/ManageCompany";
import RegisterCompany from "./pages/RegisterCompany";
import InvitationPage from './pages/InvitationPage';
import CompanyMembers from './pages/CompanyMembers';

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
                    <Route path="/manage-company" element={<ManageCompany />} />
                    <Route path="/manage-company/register" element={<RegisterCompany/>} />
                    <Route path="/invitation/:token" element={<InvitationPage /> } />
                    <Route   path="/company/members" element={<CompanyMembers />} />
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
