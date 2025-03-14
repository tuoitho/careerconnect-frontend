import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrash, FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CompanyMembers = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

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
      const response = await companyService.getCompanyMembers(currentPage, 2);
      
      if (response && response.result) {
        setMembers(response.result.data || []);
        setCurrentPage(response.result.currentPage || 0);
        setTotalPages(response.result.totalPages || 0);
        setTotalMembers(response.result.totalElements || 0);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch company members");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await companyService.getInvitations(invitationCurrentPage, 2);
      
      if (response && response.result) {
        setInvitations(response.result.data || []);
        setInvitationCurrentPage(response.result.currentPage || 0);
        setInvitationTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch invitations");
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
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const response = await companyService.removeMember(memberId);
        toast.success(response.message || "Member removed successfully");
        fetchMembers();
      } catch (error) {
        toast.error(error.message || "Failed to remove member");
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
              <p className="text-sm text-gray-500 mt-1">
                Showing {members.length} of {totalMembers} total members
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Member</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={member.avatar || "https://via.placeholder.com/100"}
                                alt={member.fullname}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.fullname}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.contact || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full 
                            ${member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {member.role === 'admin' ? 'Administrator' : 'Member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {member.role !== 'admin' && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                              title="Remove member"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
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
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending invitations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invitationTotalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default CompanyMembers;