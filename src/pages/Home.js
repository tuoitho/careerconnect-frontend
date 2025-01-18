import React from 'react';
import { Search, Briefcase, Building2, MapPin, ChevronRight } from 'lucide-react';
import Header from '../components/Header';

const Home = () => {
    const featuredJobs = [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "Tech Solutions Inc",
            location: "Hà Nội",
            type: "Full-time",
            salary: "$1500-$3000",
        },
        {
            id: 2,
            title: "UX Designer",
            company: "Creative Studio",
            location: "Hồ Chí Minh",
            type: "Full-time",
            salary: "$1000-$2000",
        },
        {
            id: 3,
            title: "Product Manager",
            company: "Innovation Labs",
            location: "Đà Nẵng",
            type: "Full-time",
            salary: "$2000-$4000",
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />
            {/* Hero Section */}
            <div className="bg-black text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-6">Find Your Dream Job</h1>
                    <div className="flex gap-4 bg-white p-4 rounded-lg">
                        <div className="flex-1 flex items-center gap-2">
                            <Search className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Job title or keyword"
                                className="w-full focus:outline-none text-black"
                            />
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Jobs */}
            <div className="container mx-auto px-4 py-12">
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
        </div>
    );
};

export default Home;
