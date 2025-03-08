import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bell, User, Briefcase, FileText, Book, MessageSquare, ChevronRight } from 'lucide-react';

const Header = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    // Sample notifications data
    const notifications = [
        {
            id: 1,
            title: "Ứng tuyển thành công",
            message: "Bạn đã ứng tuyển thành công vào vị trí Frontend Developer tại ABC Company",
            time: "2 giờ trước",
            isRead: false
        },
        {
            id: 2,
            title: "Phỏng vấn mới",
            message: "Bạn có lịch phỏng vấn mới vào ngày 15/03/2025 với XYZ Corp",
            time: "1 ngày trước",
            isRead: false
        },
        {
            id: 3,
            title: "Việc làm phù hợp",
            message: "Chúng tôi tìm thấy 5 việc làm phù hợp với kỹ năng của bạn",
            time: "3 ngày trước",
            isRead: true
        }
    ];

    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    const handleNotificationClick = (e) => {
        e.stopPropagation();
        setShowNotifications(!showNotifications);
        // Close user dropdown if open
        if (showDropdown) {
            setShowDropdown(false);
        }
    };

    const handleUserDropdownClick = () => {
        setShowDropdown(!showDropdown);
        // Close notifications if open
        if (showNotifications) {
            setShowNotifications(false);
        }
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowNotifications(false);
            setShowDropdown(false);
        };

        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-black text-white py-2 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-bold">Career Connect</Link>
                    
                    <nav className="flex items-center gap-4">
                        <Link to="/" className="text-sm text-white hover:text-green-400">Home</Link>
                        <Link to="/jobs" className="text-sm text-white hover:text-green-400">Jobs</Link>
                        <Link to="/freelance" className="text-sm text-white hover:text-green-400">Freelance</Link>
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
                                <button 
                                    className="text-white hover:text-green-400"
                                    onClick={handleUserDropdownClick}
                                >
                                    <span className="text-green-400 mr-2">Xin chào, {user.username}</span>
                                    <User className="inline" size={18} />
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50" onClick={e => e.stopPropagation()}>
                                        <Link to="/candidate/profile" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <User className="inline mr-2" size={16} />
                                            Hồ sơ cá nhân
                                        </Link>
                                        <Link to="/candidate/applied" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <Briefcase className="inline mr-2" size={16} />
                                            Việc làm đã ứng tuyển
                                        </Link>
                                        <Link to="/candidate/job-alerts" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <Bell className="inline mr-2" size={16} />
                                            Nhận thông báo việc làm
                                        </Link>
                                        <Link to="/candidate/saved" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <FileText className="inline mr-2" size={16} />
                                            Việc làm đã lưu
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Nút Chat */}
                            <a href="/candidate/chat" target="_blank" className="relative" title="Chat với nhà tuyển dụng">
                                <MessageSquare className="text-white hover:text-green-400" size={18} />
                            </a>

                            {/* Nút Thông báo với Dropdown */}
                            <div className="relative">
                                <button 
                                    className="relative"
                                    onClick={handleNotificationClick}
                                >
                                    <Bell className="text-white hover:text-green-400" size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {showNotifications && (
                                    <div 
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-800">Thông báo</h3>
                                        </div>
                                        
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-6 text-center text-gray-500">
                                                    Bạn chưa có thông báo nào
                                                </div>
                                            ) : (
                                                notifications.map(notification => (
                                                    <div 
                                                        key={notification.id} 
                                                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-green-50' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium text-sm">{notification.title}</h4>
                                                            <span className="text-xs text-gray-500">{notification.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full absolute top-3 right-3"></div>
                                                        )}
                                                    </div>
                                                ))
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

                            <button 
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/login"
                                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                            >
                                Đăng nhập
                            </Link>
                            <Link 
                                to="/register"
                                className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
