import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyService } from "../services/companyServiceWithHook";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaTrash, FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import apiService from "../api/apiService";

const CompanyMembersWithHook = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  // Invitations pagination
  const [invitations, setInvitations] = useState([]);
  const [invitationCurrentPage, setInvitationCurrentPage] = useState(0);
  const [invitationTotalPages, setInvitationTotalPages] = useState(0);

  const [inviteEmail, setInviteEmail] = useState("");

  // Sử dụng hook useCompanyService
  const companyService = useCompanyService();

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
      // Sử dụng execute từ hook
      const response = await companyService.getCompanyMembers.execute(currentPage, 2);
      
      if (response && response.result) {
        setMembers(response.result.data || []);
        setCurrentPage(response.result.currentPage || 0);
        setTotalPages(response.result.totalPages || 0);
        setTotalMembers(response.result.totalElements || 0);
      }
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };

  const fetchInvitations = async () => {
    try {
      // Sử dụng execute từ hook
      const response = await companyService.getInvitations.execute(invitationCurrentPage, 2);
      
      if (response && response.result) {
        setInvitations(response.result.data || []);
        setInvitationCurrentPage(response.result.currentPage || 0);
        setInvitationTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // Sử dụng execute từ hook
      await companyService.inviteMember.execute(inviteEmail);
      setInviteEmail("");
      // Refresh invitations after sending
      fetchInvitations();
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const response = await apiService.delete(`/company/mycompany/members/${memberId}`);
        toast.success(response.message);
        fetchMembers();
      } catch (error) {
        toast.error(error.message || "Failed to remove member");
      }
    }
  };

  // Sử dụng loading state từ hook
  if (companyService.getCompanyMembers.loading) {
    return <LoadingSpinner message="Loading company members..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Members</h1>
      
      {/* Phần hiển thị UI giống như component gốc */}
      
      {/* Hiển thị lỗi nếu có */}
      {companyService.getCompanyMembers.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {companyService.getCompanyMembers.error.message || "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default CompanyMembersWithHook;