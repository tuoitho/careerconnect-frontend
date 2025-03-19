import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import ManageCompany from "../pages/ManageCompany";
import PostJob from "../pages/PostJob";
import RecruiterProfile from "../pages/RecruiterProfile";
import PostedJobDetail from "../pages/PostedJobDetail";
import CandidateProfile from "../pages/CandidateProfile";
import CompanyPage from "../pages/CompanyPage";
import JobDetail from "../pages/CompanyJobDetail";
import JobSearch from "../pages/JobSearch";
import AppliedJobsList from "../pages/AppliedJob";
import ChatPage from "../pages/ChatPage";
import RecruiterChatPage from "../pages/RecruiterChatPage";
import SavedJobsPage from "../pages/SavedJobsPage";
import JobAlertSubscription from "../pages/JobAlertSubscription";
import NotificationsPage from "../pages/NotificationsPage";
import Freelance from "../pages/Freelance";
import CareerGuide from "../pages/CareerGuide";
import BrowertJobPage from "../api/BrowertJobPage";
import ApplicationDetail from "../pages/ApplicationDetail";
import CandidateDetail from "../pages/CandidateDetail";
import PaymentResultPage from "../api/PaymentResultPage";
import TopUpPage from "../api/TopUpPage";
import CoinManagementPage from "../api/CoinManagementPage";
import AuthContext from "../context/AuthContext";

const AppRoutes = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const role = user?.role?.toLowerCase();

  return (
    <Routes>
      {/* Public Routes (No Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Public Routes with Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/top-up" element={<TopUpPage />} />
              <Route path="/payment-result" element={<PaymentResultPage />} />
              <Route path="/coin-management" element={<CoinManagementPage />} />
              <Route path="/job-page" element={<BrowertJobPage />} />
              <Route path="/job/search" element={<JobSearch />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/freelance" element={<Freelance />} />
              <Route path="/career-guide" element={<CareerGuide />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/*"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterLayout>
              <Routes>
                <Route index element={<RecruiterHome />} />
                <Route path="application/:applicationId" element={<ApplicationDetail />} />
                <Route path="profile" element={<RecruiterProfile />} />
                <Route path="company" element={<ManageCompany />} />
                <Route path="manage-company/register" element={<RegisterCompany />} />
                <Route path="invitation/:token" element={<InvitationPage />} />
                <Route path="company/members" element={<CompanyMembers />} />
                <Route path="company/jobs" element={<PostJob />} />
                <Route path="company/jobs/:jobId" element={<PostedJobDetail />} />
                <Route path="candidate/:candidateId" element={<CandidateDetail />} />
                <Route path="chat" element={<RecruiterChatPage />} />
                <Route path="chat/:candidateId" element={<RecruiterChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RecruiterLayout>
          </ProtectedRoute>
        }
      />

      {/* Candidate Routes */}
      <Route
        path="/candidate/*"
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <Layout>
              <Routes>
                <Route index element={<Home />} />
                <Route path="company/:companyId" element={<CompanyPage />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="applied" element={<AppliedJobsList />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="saved" element={<SavedJobsPage />} />
                <Route path="job-alerts" element={<JobAlertSubscription />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Root Route with Role-Based Redirection */}
      <Route
        path="/"
        element={
          isAuthenticated && role ? (
            role === "recruiter" ? (
              <Navigate to="/recruiter" />
            ) : role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Layout>
                <Home />
              </Layout>
            )
          ) : (
            <Layout>
              <Home />
            </Layout>
          )
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;