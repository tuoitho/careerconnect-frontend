import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaPlus,
  FaEdit,
  FaUpload,
  FaLink,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Sidebar from "../components/recruiter/Sidebar";

const ManageCompany = () => {
  const [company, setCompany] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null); // State để lưu file hình ảnh được chọn
  const [isEditing, setIsEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm();

  // Fetch company data
  useEffect(() => {
    companyService
      .getCompany()
      .then((response) => {
        console.log(response);
        setCompany(response.result);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // Handle invite member
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!validateEmail(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await companyService.inviteMember({ email: inviteEmail });
      setInviteEmail("");
      toast.success("Invitation sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      console.log(data);
      if (selectedLogo) formData.append("logo", selectedLogo);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("website", data.website);

      const response = await companyService.updateCompany(formData);
      setCompany(response.result);
      setIsEditing(false);
      toast.success(response.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update company");
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {!company ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No Company Linked</h2>
              <Link
                to="/recruiter/manage-company/register"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus className="inline mr-2" />
                Register Company
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Manage Company</h2>
                <div className="flex gap-2">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Company Name *
                        {errors.name && (
                          <span className="text-red-500 text-sm ml-2">
                            This field is required
                          </span>
                        )}
                      </label>
                      <input
                        {...register("name", { required: true })}
                        className={`w-full p-2 border rounded ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Logo
                      </label>
                      <div className="flex items-center gap-4">
                        {(selectedLogo || company.logo) && (
                          <img
                            src={
                              selectedLogo
                                ? URL.createObjectURL(selectedLogo)
                                : company.logo
                            }
                            alt="Current logo"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                          <FaUpload className="inline mr-2" />
                          Upload New
                          <input
                            type="file"
                            {...register("logo")}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const file = e.target.files[0];
                                setSelectedLogo(file); // Lưu file vào state
                                setValue("logo", file); // Cập nhật giá trị cho react-hook-form
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Description
                      </label>
                      <textarea
                        {...register("description")}
                        className="w-full p-2 border border-gray-300 rounded h-32"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Address
                      </label>
                      <input
                        {...register("address")}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Website
                      </label>
                      <div className="flex">
                        <span className="bg-gray-100 p-2 rounded-l border border-r-0 border-gray-300">
                          <FaLink className="text-gray-500" />
                        </span>
                        <input
                          type="url"
                          {...register("website")}
                          className="w-full p-2 border border-gray-300 rounded-r"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        reset(company); // Reset to original values
                      }}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <FaTimes className="inline mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isDirty}
                      className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors ${
                        !isDirty
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      }`}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">
                        Company Name
                      </h3>
                      <p className="text-gray-900">{company.name}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">Logo</h3>
                      {company.logo && (
                        <img
                          src={company.logo || "/placeholder.svg"}
                          alt="Company Logo"
                          className="w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-2 text-gray-700">
                        Description
                      </h3>
                      <p className="text-gray-900 whitespace-pre-line">
                        {company.description || "No description provided"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">
                        Address
                      </h3>
                      <p className="text-gray-900">
                        {company.address || "No address provided"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-gray-700">
                        Website
                      </h3>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {company.website}
                        </a>
                      ) : (
                        <p className="text-gray-500">No website provided</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Team Management</h3>
                    <form
                      onSubmit={handleInvite}
                      className="flex gap-4 max-w-xl"
                    >
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        Send Invite
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;