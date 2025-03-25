import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(selectUser);
const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const role = user.role.toLowerCase();

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Lưu lại trang người dùng đang cố truy cập
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;