import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RecruiterLayout from "../components/recruiter/RecruiterLayout";
import Layout from "../components/Layout";
import LoginPage from "../pages/LoginPage";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Registration from "../pages/Registration";
import Unauthorized from "../pages/Unauthorized";
import RecruiterHome from "../pages/RecruiterHome";
import RegisterCompany from "../pages/RegisterCompany";
import InvitationPage from "../pages/InvitationPage";
import CompanyMembers from "../pages/CompanyMembers";
import MC from "../pages/ManageCompany";
import PostJob from "../pages/PostJob";
import RecuiterProfile from "../pages/RecruiterProfile";
import { Navigate } from "react-router-dom";
import PostedJobDetail from "../pages/PostedJobDetail";
import CandidateProfile from "../pages/CandidateProfile";
import CompanyPage from "../pages/CompanyPage";
import JobDetail from "../pages/CompanyJobDetail";
import JobSearch from "../pages/JobSearch";
const   AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Recruiter Routes */}
      <Route path="/recruiter/*"        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterLayout>
              <Routes>
                <Route path="/profile" element={<RecuiterProfile />} />
                <Route path="/" element={<RecruiterHome />} />
                <Route path="/company" element={<MC />} />
                <Route path="/manage-company/register" element={<RegisterCompany />}                />
                <Route                  path="/invitation/:token"                  element={<InvitationPage />}                />
                <Route path="/company/members" element={<CompanyMembers />} />
                <Route path="/company/jobs" element={<PostJob />} />
                <Route path="/company/jobs/:jobId" element={<PostedJobDetail />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </RecruiterLayout>
          </ProtectedRoute>
        }
      />



      {/* User Routes */}
      <Route        path="/*"        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/company/:companyId" element={<CompanyPage />} />
                <Route path="/job/:id" element={<JobDetail />} />  
                <Route path="/job/search" element={<JobSearch />} />
                <Route path="/profile" element={<CandidateProfile />} />
                <Route path="*" element={<NotFound />} />
                {/* Add more user routes */}
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for 404 */}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;