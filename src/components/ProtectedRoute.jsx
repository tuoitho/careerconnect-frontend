import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  // if (!user) {
  //   return <Navigate to="/login" />;
  // }
  const roletemp="recruiter";
  // if (allowedRoles && !allowedRoles.includes(roletemp)) {
  //   return <Navigate to="/unauthorized" />;
  // }
  
  return children;
};

export default ProtectedRoute;