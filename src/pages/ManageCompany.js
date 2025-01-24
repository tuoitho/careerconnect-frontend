import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaUpload, FaLink } from 'react-icons/fa';

const ManageCompany = () => {
    const [company, setCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch company data
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                // Replace with your API call
                const response = await axios.get('/api/company');
                setCompany(response.data);
            } catch (err) {
                setError('Failed to fetch company data');
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, []);

    // Handle invite member
    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;
        try {
            await axios.post('/api/company/invite', { email: inviteEmail });
            setInviteEmail('');
            alert('Invitation sent successfully');
        } catch (err) {
            setError('Failed to send invitation');
        }
    };

    // Handle company form submit
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            if (data.logo[0]) formData.append('logo', data.logo[0]);
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('address', data.address);
            formData.append('website', data.website);

            // Replace with your API call
            const response = await axios.put('/api/company', formData);
            setCompany(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update company');
        }
    };

    // Handle delete company
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await axios.delete('/api/company');
            setCompany(null);
        } catch (err) {
            setError('Failed to delete company');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {!company ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No Company Linked</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        <FaPlus className="inline mr-2" />
                        Create Company
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Manage Company</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                                <FaEdit className="inline mr-2" />
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company Name</label>
                                    <input
                                        {...register('name', { required: true })}
                                        defaultValue={company.name}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Logo</label>
                                    <div className="flex items-center">
                                        <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded">
                                            <FaUpload className="inline mr-2" />
                                            Upload
                                            <input
                                                type="file"
                                                {...register('logo')}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        {...register('description')}
                                        defaultValue={company.description}
                                        className="w-full p-2 border rounded h-32"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        {...register('address')}
                                        defaultValue={company.address}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Website</label>
                                    <div className="flex">
                    <span className="bg-gray-100 p-2 rounded-l">
                      <FaLink />
                    </span>
                                        <input
                                            type="url"
                                            {...register('website')}
                                            defaultValue={company.website}
                                            className="w-full p-2 border rounded-r"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">Company Name</h3>
                                    <p>{company.name}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Logo</h3>
                                    {company.logo && (
                                        <img
                                            src={company.logo}
                                            alt="Company Logo"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="whitespace-pre-line">{company.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Address</h3>
                                    <p>{company.address}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Website</h3>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {company.website}
                                    </a>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4">Invite Members</h3>
                                <form onSubmit={handleInvite} className="flex gap-4">
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="flex-1 p-2 border rounded"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Send Invite
                                    </button>
                                </form>
                            </div>

                            <div className="mt-8 border-t pt-4">
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash className="inline mr-2" />
                                    Delete Company
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageCompany;
