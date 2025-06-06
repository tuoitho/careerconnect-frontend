import React, { useState, useEffect } from 'react';  
import { Search, Briefcase, Building2, MapPin, ChevronRight } from 'lucide-react';  
import Header from '../components/Header';  
import JobCategories from '../components/JobCategories';  
import HowItWorks from '../components/HowItWorks';  
import { Link, useNavigate } from 'react-router-dom';  
import { UserPlus } from 'lucide-react';  
// import AuthContext from '../context/AuthContext'; // Removed unused import
import { toast } from 'react-toastify';

const Home = () => {  
    const [searchQuery, setSearchQuery] = useState('');  
    const [location, setLocation] = useState('');  
    const navigate = useNavigate();  

    // Replace the existing useEffect with this updated version
    useEffect(() => {  
        if (searchQuery.trim()) {  
            const searchParams = new URLSearchParams();
            searchParams.append('query', searchQuery.trim());
            if (location) {
                searchParams.append('location', location);
            }
            navigate(`/job/search?${searchParams.toString()}`);
        }  
    }, [searchQuery, location, navigate]);  

    // Handler for search button click
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() || location) {
            const searchParams = new URLSearchParams();
            if (searchQuery.trim()) {
                searchParams.append('query', searchQuery.trim());
            }
            if (location) {
                searchParams.append('location', location);
            }
            navigate(`/job/search?${searchParams.toString()}`);
        }
    };

   

    return (  
        <div className="min-h-screen bg-white">  
            {/* Recruitment Buttons */}  
            <div className="bg-gradient-to-r from-black via-gray-900 to-black py-6">  
                <div className="container mx-auto px-4 max-w-4xl flex justify-center gap-6">  
                    <button   
                        onClick={() => toast.info("Vui lòng đăng nhập tài khoản nhà tuyển dụng")}
                        to="/"   
                        className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg   
                                   text-sm font-medium transition-all duration-300 transform hover:scale-105   
                                   hover:shadow-lg flex items-center gap-2"  
                    >  
                        <Briefcase size={18} />  
                        <span>Đăng tuyển</span>  
                    </button>  
                    <Link   
                        to="/job/search"   
                        className="group border-2 border-white text-white px-8 py-3 rounded-lg text-sm   
                                   font-medium transition-all duration-300 transform hover:scale-105   
                                   hover:shadow-lg hover:bg-white hover:text-black flex items-center gap-2"  
                    >  
                        <UserPlus size={18} />  
                        <span>Ứng tuyển</span>  
                    </Link>  
                </div>  
            </div>  

            <div className="bg-black text-white py-12">  
                <div className="container mx-auto px-4 max-w-4xl">  
                    <h1 className="text-4xl font-bold mb-6 text-center">Find Your Dream Job</h1>  
                    <div className="flex gap-2 bg-white p-3 rounded-lg items-center">  
                        <div className="flex-1 flex items-center gap-2 border-r border-gray-300 pr-2">  
                            <Search className="text-gray-400" size={20} />  
                            <input   
                                type="text"   
                                placeholder="Job title or keyword"  
                                value={searchQuery}  
                                onChange={(e) => setSearchQuery(e.target.value)}  
                                className="w-full focus:outline-none text-black text-sm"  
                            />  
                        </div>  
                        <div className="flex items-center gap-2 px-2">  
                            <MapPin className="text-gray-400" size={20} />  
                            <select   
                                value={location}  
                                onChange={(e) => setLocation(e.target.value)}  
                                className="w-48 focus:outline-none text-black text-sm bg-transparent"  
                            >  
                                <option value="">All Locations</option>  
                                {/* <option value="hanoi">Hà Nội</option>  
                                <option value="hcm">Hồ Chí Minh</option>  
                                <option value="danang">Đà Nẵng</option>   */}
                            </select>  
                        </div>  
                        <button 
                            onClick={handleSearch}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition">  
                            Search  
                        </button>  
                    </div>  
                </div>  
            </div>  
            <JobCategories />  
            {/* <HowItWorks /> */}  

            {/* Featured Jobs */}  
            {/* <div className="border-t">  
                <div className="container mx-auto px-8 py-12 max-w-7xl mx-auto flex items-center justify-between px-4">  
                    <h2 className="text-2xl font-bold mb-8 text-black">Featured Jobs</h2>  
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">  
                        {featuredJobs.map(job => (  
                            <div key={job.id} className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition">  
                                <h3 className="text-xl font-semibold text-black mb-2">{job.title}</h3>  
                                <div className="flex items-center gap-2 text-gray-600 mb-2">  
                                    <Building2 size={16} />  
                                    <span>{job.company}</span>  
                                </div>  
                                <div className="flex items-center gap-2 text-gray-600 mb-4">  
                                    <MapPin size={16} />  
                                    <span>{job.location}</span>  
                                </div>  
                                <div className="flex justify-between items-center">  
                                    <span className="text-green-500 font-semibold">{job.salary}</span>  
                                    <button className="text-black hover:text-green-500 flex items-center gap-1">  
                                        View Details  
                                        <ChevronRight size={16} />  
                                    </button>  
                                </div>  
                            </div>  
                        ))}  
                    </div>  
                </div>  
            </div>   */}
        </div>  
    );  
};  

export default Home;
