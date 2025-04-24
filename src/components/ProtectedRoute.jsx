import { Navigate, useLocation } from 'react-router-dom';
// import AuthContext from '../context/AuthContext'; // Removed AuthContext
// import { useContext } from 'react'; // Removed useContext
import { useSelector } from 'react-redux'; // Added useSelector
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice'; // Import Redux selectors
import LoadingSpinner from './LoadingSpinner'; // Optional: Add a loading state

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const { user, isAuthenticated } = useContext(AuthContext); // Removed context usage
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector((state) => state.auth.status); // Get auth status
  const location = useLocation();

  // Optional: Handle initial loading state while auth status is being determined
  if (authStatus === 'idle' || authStatus === 'loading') {
    // You might want to show a loading spinner while checking auth state,
    // especially on initial app load. This prevents flickering.
    // return <LoadingSpinner />; // Or some other loading indicator
  }

  if (!isAuthenticated) {
    // Redirect to login, passing the intended destination via state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure user object and role exist before checking roles
  if (!user || !user.role) {
    // This case might indicate an issue with the user data in the store
    console.error("ProtectedRoute: User data or role is missing despite being authenticated.");
    // Redirect to login or an error page might be appropriate
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user.role.toLowerCase();

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    // Lưu lại trang người dùng đang cố truy cập
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
