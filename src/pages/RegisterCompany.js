import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import { companyService } from '../services/companyService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterCompany = () => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (selectedLogo) {
        formData.append('logo', selectedLogo);
      }

      await companyService.createCompany(formData);
      toast.success('Company registered successfully!');
      navigate('/recruiter/manage-company');
    } catch (error) {
      toast.error(error.message || 'Failed to register company');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Registering company..." />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Register Your Company</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Company name is required" })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            {...register("website")}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-4">
            {selectedLogo && (
              <img
                src={URL.createObjectURL(selectedLogo)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <label className="cursor-pointer bg-gray-50 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
              <FaUpload className="inline mr-2" />
              Choose Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedLogo(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Register Company
        </button>
      </form>
    </div>
  );
};

export default RegisterCompany;