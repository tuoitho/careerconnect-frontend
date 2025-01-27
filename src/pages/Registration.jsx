import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    if (!formData.fullname.trim()) errors.fullname = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.userType) errors.userType = "Please select a user type";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      registerUser(formData)
        .then((response) => {
          toast.success(response.message); // Hiển thị thông báo thành công
        })
        .catch((error) => {
          // Lỗi đã được xử lý trong interceptor, chỉ cần log hoặc cập nhật UI
          console.error("Registration Error:", error.message);
        })
        .finally(() => {
          setIsLoading(false); // Dừng loading
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {isLoading && (
        <LoadingSpinner
          message="Creating your account..."
          color="blue"
          size="default"
        />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>
              {errors.fullname && (
                <p className="mt-2 text-sm text-red-600">{errors.fullname}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="employer"
                    name="userType"
                    type="radio"
                    value="RECRUITER"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    checked={formData.userType === "RECRUITER"}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="employer"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    RECRUITER
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="candidate"
                    name="userType"
                    type="radio"
                    value="CANDIDATE"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    checked={formData.userType === "CANDIDATE"}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="CANDIDATE"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Candidate
                  </label>
                </div>
              </div>
              {errors.userType && (
                <p className="mt-2 text-sm text-red-600">{errors.userType}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
          {isLoading && <p>Registering...</p>}
        </div>
      </div>
    </div>
  );
};

export default Registration;
