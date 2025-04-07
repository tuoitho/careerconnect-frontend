import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { File, Edit, Trash2, Plus, Download, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cvService from '../services/cvService';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const CVManagement = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCVs();
  }, [isAuthenticated]);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await cvService.fetchCVs();
      if (response.result) {
        setCvs(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      toast.error('Không thể tải danh sách CV');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCV = () => {
    navigate('/candidate/cv-builder');
  };

  const handleEditCV = (cvId) => {
    navigate(`/candidate/cv-builder/${cvId}`);
  };

  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này không?')) {
      return;
    }

    try {
      await cvService.deleteCV(cvId);
      toast.success('Xóa CV thành công');
      fetchCVs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Không thể xóa CV');
    }
  };

  const handleSetDefaultCV = async (cvId) => {
    try {
      await cvService.setDefaultCV(cvId);
      toast.success('Đã đặt làm CV mặc định');
      fetchCVs(); // Refresh the list to update default status
    } catch (error) {
      console.error('Error setting default CV:', error);
      toast.error('Không thể đặt CV mặc định');
    }
  };

  const handleGeneratePDF = async (cvId) => {
    try {
      const response = await cvService.generatePDF(cvId);
      
      // Create a blob from the PDF response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV-${cvId}.pdf`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      toast.success('Tải xuống PDF thành công');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Không thể tạo file PDF');
    }
  };

  // Helper function to get CV name from content
  const getCVName = (cv) => {
    if (cv.name) return cv.name;
    
    try {
      // Try to parse content if it's a string
      if (typeof cv.content === 'string') {
        const content = JSON.parse(cv.content);
        return content.personalInfo?.fullName || 'Untitled CV';
      }
      // If content is already an object
      return cv.content?.personalInfo?.fullName || 'Untitled CV';
    } catch (e) {
      return 'Untitled CV';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <File className="text-blue-500" />
          Quản lý CV
        </h1>
        <button
          onClick={handleCreateCV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tạo CV mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cvs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <div className="text-gray-500 mb-6">
            Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn!
          </div>
          <button
            onClick={handleCreateCV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus size={20} />
            Tạo CV mới
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                {cv.previewImage ? (
                  <img
                    src={cv.previewImage}
                    alt={`Preview of ${getCVName(cv)}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-5xl">
                    <File size={64} />
                  </div>
                )}
                {cv.isDefault && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full">
                    <Star size={16} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{getCVName(cv)}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Cập nhật: {new Date(cv.updatedDate || cv.createdDate).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditCV(cv.id)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                    title="Chỉnh sửa CV"
                  >
                    <Edit size={16} />
                    <span>Xem/Chỉnh sửa/Export PDF</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleDeleteCV(cv.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                    title="Xóa CV"
                  >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVManagement;
