import { useState, useEffect, useRef } from 'react'; // Removed useContext
import { useDispatch } from 'react-redux'; // Added useDispatch
import { Link } from 'react-router-dom';
import { FaBell, FaComment, FaUser, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
// import AuthContext from '../../context/AuthContext'; // Removed AuthContext
// Import the async thunk instead of the old action
import { logoutUser } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch(); // Get dispatch function
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const { logout } = useContext(AuthContext); // Removed context usage

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // logout(); // Removed context usage
    // Dispatch the logoutUser thunk
    dispatch(logoutUser());
  };
  return (
    <header className="bg-white shadow-sm fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center text-xl font-bold text-green-800">
              {/* <Link to="/" className="text-xl font-bold text-gray-800"> */}
                CareerConnect
              {/* </Link> */}
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/post-job"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Post Job
              </Link> */}
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <FaBell className="h-6 w-6" />
            </button>

            <Link
              to="/recruiter/chat"
              className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Chat</span>
              <FaComment className="h-6 w-6" />
            </Link>

            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <FaUser className="h-6 w-6" />
                </button>
              </div>

              {isOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                >
                  <Link
                    to="/recruiter/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    role="menuitem"
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/recruiter/company"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    role="menuitem"
                  >
                    <FaBuilding className="mr-2" />
                    Manage Company
                  </Link>
                  <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
              >
                <FaSignOutAlt className="mr-2" />
                Log out
              </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
