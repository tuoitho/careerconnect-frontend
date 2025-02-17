import React, { use, useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bell, User, Briefcase, FileText, Book } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { DEFAULT_ROUTES } from '../route/defaultroutes';
const Header = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();



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
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <span className="text-green-400 mr-2">Xin chào, {user.username}</span>
                                    <User className="inline" size={18} />
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                        <Link to="/candidate/profile" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <User className="inline mr-2" size={16} />
                                            Hồ sơ cá nhân
                                        </Link>
                                        <Link to="/applied-jobs" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <Briefcase className="inline mr-2" size={16} />
                                            Việc làm đã ứng tuyển
                                        </Link>
                                        <Link to="/manage-cv" className="block px-4 py-2 text-gray-800 hover:bg-green-50">
                                            <FileText className="inline mr-2" size={16} />
                                            Quản lý CV
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            <Link to="/notifications" className="relative">
                                <Bell className="text-white hover:text-green-400" size={18} />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    3
                                </span>
                            </Link>

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