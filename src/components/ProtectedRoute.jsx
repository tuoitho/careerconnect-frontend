import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
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