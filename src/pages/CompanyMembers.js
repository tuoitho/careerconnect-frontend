import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
// import { FaTrash, FaUserPlus } from "react-icons/fa";
import { FaTrash, FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CompanyMembers = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);

  // Invitations pagination
  const [invitations, setInvitations] = useState([]);
  const [invitationCurrentPage, setInvitationCurrentPage] = useState(0);
  const [invitationTotalPages, setInvitationTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  useEffect(() => {
    fetchInvitations();
  }, [invitationCurrentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInvitationPageChange = (newPage) => {
    if (newPage >= 0 && newPage < invitationTotalPages) {
      setInvitationCurrentPage(newPage);
    }
  };

  const fetchMembers = async () => {
    try {
      // pageSize set to 2 as an example
      const response = await companyService.getCompanyMembers(currentPage, 2);
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
      // pageSize set to 2 as an example
      const response = await companyService.getInvitations(invitationCurrentPage, 2);
      if (response) {
        toast.success(response.message);
        setInvitations(response.result.data);
        setInvitationCurrentPage(response.result.currentPage);
        setInvitationTotalPages(response.result.totalPages);
      }
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
      // Refresh invitations after sending
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Invite Section */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Invite New Member</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <FaUserPlus className="w-4 h-4" />
                {sending ? "Sending Invite..." : "Send Invitation"}
              </button>
            </form>
          </div>
        </div>

        {/* Members Section */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Company Members</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove member"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <FaChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage + 1}</span> of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Next
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Invitations Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Pending Invitations</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{invitation.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(invitation.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleInvitationPageChange(invitationCurrentPage - 1)}
              disabled={invitationCurrentPage === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <FaChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{invitationCurrentPage + 1}</span> of {invitationTotalPages}
            </span>
            <button
              onClick={() => handleInvitationPageChange(invitationCurrentPage + 1)}
              disabled={invitationCurrentPage === invitationTotalPages - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyMembers;