import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Briefcase,
  FileText,
  Book,
  MessageSquare,
  ChevronRight,
  DollarSign,
  Video,
  Menu,
  X,
} from "lucide-react";
import NotificationDetailModal from "./NotificationDetailModal";
import apiService from "../services/apiService.js";
import { selectIsAuthenticated, selectCurrentUser, logoutUser } from '../store/slices/authSlice';
import { 
  fetchNotifications, 
  clearNotifications,
  markNotificationAsReadLocally, 
  selectAllNotifications, 
  selectNotificationsStatus,
  selectLastFetchTimestamp,
  selectUnreadNotificationsCount
} from '../store/slices/notificationsSlice';

// Cache duration in milliseconds (1 minute)
const CACHE_DURATION = 60 * 1000;

export default function Header() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const notifications = useSelector(selectAllNotifications);
  const notificationsStatus = useSelector(selectNotificationsStatus); // Đúng tên selector
  const lastFetchTimestamp = useSelector(selectLastFetchTimestamp); // Thêm selector cho lastFetchTimestamp

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const hasFetchedRef = useRef(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    console.log('[Header] Effect running', {
      path: window.location.pathname,
      isPageReload: true,
      status: notificationsStatus,
      timestamp: new Date().toISOString(),
    });
    if (isAuthenticated && notificationsStatus === 'idle' && !hasFetchedRef.current) {
      console.log('[Header] Dispatching fetchNotifications...');
      dispatch(fetchNotifications());
      hasFetchedRef.current = true;
    }
    if (!isAuthenticated) {
      setShowNotifications(false);
      setShowDropdown(false);
      hasFetchedRef.current = false;
    }
  }, [isAuthenticated, notificationsStatus, dispatch]);

  const handleNotificationClick = (e, notification) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedNotification(notification);
    setIsModalOpen(true);
    setShowNotifications(false);

    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = async (id) => {
    dispatch(markNotificationAsReadLocally(id));
    try {
      await apiService.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking as read:", error);
      dispatch(fetchNotifications(true));
    }
  };

  const handleUserDropdownClick = (e) => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
    if (showNotifications) setShowNotifications(false);
  };

  const handleNotificationsToggle = (e) => {
    e.stopPropagation();
    const opening = !showNotifications;
    setShowNotifications(opening);
    if (showDropdown) setShowDropdown(false);

    if (opening) {
      const now = new Date().getTime();
      const isCacheExpired = !lastFetchTimestamp || (now - lastFetchTimestamp > CACHE_DURATION);
      
      if (isCacheExpired || notifications.length === 0) {
        console.log('[Header] Cache expired or no data, fetching notifications');
        dispatch(fetchNotifications(false));
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowDropdown(false);
      setMobileMenuOpen(false); // Close mobile menu when clicking outside
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white py-2 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Career Connect
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-green-400"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm text-white hover:text-green-400">
              Home
            </Link>
            <Link to="/job-page" className="text-sm text-white hover:text-green-400">
              Jobs
            </Link>
            <Link to="/freelance" className="text-sm text-white hover:text-green-400">
              Freelance
            </Link>
            <Link to="/career-guide" className="text-sm text-white hover:text-green-400">
              <Book className="inline mr-1" size={16} />
              Cẩm nang nghề nghiệp
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="text-white hover:text-green-400" onClick={handleUserDropdownClick}>
                  <span className="text-green-400 mr-2 hidden sm:inline">Xin chào, {user?.username}</span>
                  <User className="inline" size={18} />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to="/candidate/profile" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <User className="inline mr-2" size={16} />
                      Hồ sơ
                    </Link>
                    <Link to="/candidate/applied" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <Briefcase className="inline mr-2" size={16} />
                      Ứng tuyển
                    </Link>
                    <Link to="/candidate/interviews" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <Video className="inline mr-2" size={16} />
                      Phỏng vấn
                    </Link>
                    <Link to="/candidate/job-alerts" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <Bell className="inline mr-2" size={16} />
                      Thông báo việc làm
                    </Link>
                    <Link to="/candidate/saved" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <FileText className="inline mr-2" size={16} />
                      Việc làm đã lưu
                    </Link>
                    <Link to="/candidate/cvs" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <FileText className="inline mr-2" size={16} />
                      Quản lý CV
                    </Link>
                    <Link to="/coin-management" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                      <DollarSign className="inline mr-2" size={16} />
                      Quản lý xu
                    </Link>
                  </div>
                )}
              </div>

              <a href="/candidate/chat" target="_blank" className="relative" title="Chat với nhà tuyển dụng">
                <MessageSquare className="text-white hover:text-green-400" size={18} />
              </a>

              <div className="relative">
                <button className="relative" onClick={handleNotificationsToggle}>
                  <Bell className="text-white hover:text-green-400" size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Thông báo</h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notificationsStatus === 'loading' && notifications.length === 0 && (
                        <div className="px-4 py-6 text-center text-gray-500">Đang tải...</div>
                      )}
                      {notificationsStatus !== 'loading' && notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500">Bạn chưa có thông báo nào</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-green-50" : ""}`}
                            onClick={(e) => handleNotificationClick(e, notification)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          </div>
                        ))
                      )}
                      {notificationsStatus === 'failed' && (
                        <div className="px-4 py-3 text-center text-red-500">Lỗi tải thông báo.</div>
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        to="/candidate/notifications"
                        className="text-green-500 hover:text-green-600 text-sm font-medium flex items-center justify-center"
                      >
                        Xem tất cả thông báo
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg text-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 py-2 px-4" onClick={(e) => e.stopPropagation()}>
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-sm text-white hover:text-green-400 py-2">
              Home
            </Link>
            <Link to="/job-page" className="text-sm text-white hover:text-green-400 py-2">
              Jobs
            </Link>
            <Link to="/freelance" className="text-sm text-white hover:text-green-400 py-2">
              Freelance
            </Link>
            <Link to="/career-guide" className="text-sm text-white hover:text-green-400 py-2">
              <Book className="inline mr-1" size={16} />
              Cẩm nang nghề nghiệp
            </Link>
          </nav>
        </div>
      )}

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMarkAsRead={markAsRead}
      />
    </header>
  );
}