import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import AIChatbot from './AIChatbot';
import { selectCurrentUser } from '../store/slices/authSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';
  const currentUser = useSelector(selectCurrentUser);
  
  // Show chatbot only for candidates (not for recruiters, admins, or on login page)
  const showChatbot = currentUser && currentUser.role === 'CANDIDATE' && !isLoginPage;
  
  // Apply padding-top only to non-home pages and non-login pages
  const layoutClass = !isLoginPage ? (isHomePage ? "pt-12" : "pt-14") : "";

  return (
    <div className={layoutClass}>
      {!isLoginPage && <Header />}
      {children}
      {!isLoginPage && <Footer />}
      {showChatbot && <AIChatbot />}
    </div>
  );
};

export default Layout;