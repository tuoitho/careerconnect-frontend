import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
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
import ChatbotPage from "../pages/ChatbotPage";
import RecruiterChatPage from "../pages/RecruiterChatPage";
import SavedJobsPage from "../pages/SavedJobsPage";
import JobAlertSubscription from "../pages/JobAlertSubscription";
import NotificationsPage from "../pages/NotificationsPage";
// import JobsPage from "../pages/JobsPage";
import Freelance from "../pages/Freelance";
import CareerGuide from "../pages/CareerGuide";
import BrowertJobPage from "../pages/BrowertJobPage.jsx";
import ApplicationDetail from "../pages/ApplicationDetail";
import CandidateDetail from "../pages/CandidateDetail";
import PaymentResultPage from "../pages/PaymentResultPage.jsx";
import TopUpPage from "../pages/TopUpPage.jsx";
import CoinManagementPage from "../pages/CoinManagementPage.jsx";
import InterviewPage from "../pages/InterviewPage";
import InterviewsPage from "../pages/InterviewsPage";
import ScheduleInterview from "../pages/ScheduleInterview";
// CV Builder pages
import CVBuilder from "../pages/CVBuilder";
import CVManagement from "../pages/CVManagement";
// import AuthContext from "../context/AuthContext"; // Removed AuthContext
import { useSelector } from 'react-redux'; // Added useSelector
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice'; // Import Redux selectors
import AdminLayout from "../components/admin/AdminLayout";
import UserManagement from "../pages/admin/UserManagement";
import CompanyManagement from "../pages/admin/CompanyManagement";
import JobManagement from "../pages/admin/JobManagement";
import TransactionManagement from "../pages/admin/TransactionManagement";


// Routes cho các trang public có Layout
const GeneralRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/top-up" element={<TopUpPage />} />
      <Route path="/payment-result" element={<PaymentResultPage />} />
      <Route path="/coin-management" element={<CoinManagementPage />} />

      <Route path="/BrowertJobPage" element={<BrowertJobPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/job/search" element={<JobSearch />} />
      <Route path="/job/:id" element={<JobDetail />} />
      <Route path="/job-page" element={<BrowertJobPage />} />
      <Route path="/freelance" element={<Freelance />} />
      {/* career-guide */}
      <Route path="/career-guide" element={<CareerGuide/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

// Routes dành cho Recruiter
const RecruiterRoutes = () => (
  <ProtectedRoute allowedRoles={["recruiter"]}>
    <RecruiterLayout>
      <Routes>
        <Route index element={<ManageCompany />} />
        <Route path="application/:applicationId" element={<ApplicationDetail />} />
        <Route path="profile" element={<RecruiterProfile />} />
        <Route path="company" element={<ManageCompany />} />
        <Route path="manage-company/register" element={<RegisterCompany />} />
        <Route path="invitation/:token" element={<InvitationPage />} />
        <Route path="company/members" element={<CompanyMembers />} />
        <Route path="company/jobs" element={<PostJob />} />
        <Route path="company/jobs/:jobId" element={<PostedJobDetail />} />
        <Route path="candidate/:candidateId" element={<CandidateDetail />} />
        <Route path="/chat" element={<RecruiterChatPage />} />
        <Route path="/chat/:candidateId" element={<RecruiterChatPage />} />
        <Route path="interviews" element={<InterviewsPage />} /> {/* Route cho danh sách phỏng vấn */}
        <Route path="interview/schedule/:applicationId" element={<ScheduleInterview />} /> {/* Route cho lên lịch phỏng vấn */}
        <Route path="interview/reschedule/:interviewId" element={<ScheduleInterview />} /> {/* Route cho lên lịch lại phỏng vấn */}
        <Route path="interview/:interviewId" element={<InterviewPage />} /> {/* Route cho phòng phỏng vấn */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RecruiterLayout>
  </ProtectedRoute>
);

const AdminRoutes = () => (
  <ProtectedRoute allowedRoles={["admin"]}>
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="companies" element={<CompanyManagement />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="transactions" element={<TransactionManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  </ProtectedRoute>
);
// Routes dành cho Candidate
const CandidateRoutes = () => (
  <ProtectedRoute allowedRoles={["candidate"]}>
    <Layout>
      <Routes>
        <Route index element={<Home />} />

        <Route path="company/:companyId" element={<CompanyPage />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="applied" element={<AppliedJobsList />} />
        <Route path="chat" element={<ChatPage />} /> {/* Thêm route cho Chat */}
        <Route path="chatbot" element={<ChatbotPage />} /> {/* Thêm route cho AI Chatbot */}
        <Route path="saved" element={<SavedJobsPage />} /> {/* Thêm route cho Saved Jobs */}
        <Route path="job-alerts" element={<JobAlertSubscription />} /> {/* Thêm route cho Job Alert Subscriptions */}
        <Route path="notifications" element={<NotificationsPage />} /> {/* Thêm route cho Notifications */}
        <Route path="cvs" element={<CVManagement />} /> {/* Trang quản lý CV */}
        <Route path="cv-builder" element={<CVBuilder />} /> {/* Tạo CV mới */}
        <Route path="cv-builder/:cvId" element={<CVBuilder />} /> {/* Chỉnh sửa CV hiện có */}
        <Route path="interviews" element={<InterviewsPage />} /> {/* Route cho danh sách phỏng vấn */}
        <Route path="interview/:interviewId" element={<InterviewPage />} /> {/* Route cho phòng phỏng vấn */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  // const { user, isAuthenticated } = useContext(AuthContext); // Removed context usage
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const role = user?.role?.toLowerCase(); // Use user from Redux store


  return (
    <Routes>
      {/* Auth Routes (Login/Register - Không có Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Registration />} />

      {/* Public Routes có Layout */}
      <Route path="/*" element={<GeneralRoutes />} />

      {/* Recruiter Routes */}
      <Route path="/recruiter/*" element={<RecruiterRoutes />} />

      {/* Candidate Routes */}
      <Route path="/candidate/*" element={<CandidateRoutes />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route
          path="/"
          element={
            isAuthenticated && role // Check if authenticated and role exists
              ? role === 'recruiter'
                ? <Navigate to="/recruiter" replace />
                : role === 'admin'
                ? <Navigate to="/admin" replace />
                : <Layout><Home /></Layout> // Default to Home for authenticated candidate/other
              : <Layout><Home /></Layout> // Default to Home if not authenticated
          }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
