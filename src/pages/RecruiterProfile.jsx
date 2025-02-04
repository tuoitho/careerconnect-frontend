import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
  });

  // Giả sử có hàm fetchData để lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call để lấy dữ liệu (Thay API URL thật vào đây)
        const response = await fetch("/api/recruiter/profile");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        toast.error("Không thể tải thông tin hồ sơ.");
      }
    };
    fetchData();
  }, []);

  // Xử lý thay đổi thông tin trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call để cập nhật thông tin người dùng
      const response = await fetch("/api/recruiter/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật hồ sơ.");
      }

      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Hồ Sơ</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fullname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullname">
                Họ và Tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact">
                Liên hệ
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập thông tin liên hệ"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
