import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import AIChatbot from './AIChatbot';
import { selectCurrentUser } from '../store/slices/authSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const currentUser = useSelector(selectCurrentUser);
  
  // Show chatbot only for candidates (not for recruiters, admins, or on login page)
  const showChatbot = currentUser && currentUser.role === 'CANDIDATE' && !isLoginPage;

  return (
    <div className={!isLoginPage ? "pt-14" : ""}>
      {!isLoginPage && <Header />}
      {children}
      {!isLoginPage && <Footer />}
      {showChatbot && <AIChatbot />}
    </div>
  );
};

export default Layout;