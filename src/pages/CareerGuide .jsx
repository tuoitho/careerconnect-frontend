import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronLeft } from 'lucide-react';

const CareerGuide = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-semibold mb-4">Cẩm Nang Nghề Nghiệp</h1>
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Trang cẩm nang nghề nghiệp đang trong quá trình phát triển. Xin lỗi vì sự bất tiện này!
                        </p>
                    </div>
                    <Link to="/" className="inline-flex items-center text-green-500 hover:text-green-600 font-medium">
                        <ChevronLeft size={16} className="mr-2" />
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CareerGuide;