import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrash, FaUserPlus } from "react-icons/fa";

const CompanyMembers = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMembers();
    // fetchInvitations();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await companyService.getCompanyMembers(currentPage,2);
      if (response) {
        toast.success(response.message);
        setMembers(response.result.data);
        setCurrentPage(response.result.currentPage);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await companyService.getInvitations();
      setInvitations(response.result);
    } catch (error) {
      toast.error("Failed to fetch invitations");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await companyService.inviteMember(inviteEmail);
      toast.success("Invitation sent successfully");
      setInviteEmail("");
      fetchInvitations();
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await companyService.removeMember(memberId);
        toast.success("Member removed successfully");
        fetchMembers();
      } catch (error) {
        toast.error("Failed to remove member");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Members</h1>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="flex gap-4 mb-8">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter email address"
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          <FaUserPlus />
          {sending ? "Sending..." : "Send Invitation"}
        </button>
      </form>

      {/* Members Table */}
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-2 border rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-2 border rounded ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Pending Invitations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Invitations</h2>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{invitation.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        invitation.accepted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invitation.accepted ? "Accepted" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyMembers;
