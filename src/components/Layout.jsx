import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={!isLoginPage ? "pt-14" : ""}>
      {!isLoginPage && <Header />}
      {children}
      {!isLoginPage && <Footer />}

    </div>
  );
};

export default Layout;