import { useApi } from '../hooks/useApi';
import apiService from '../api/apiService';

export const useCompanyService = () => {
  // Tạo công ty
  const createCompanyApi = useApi(
    async (companyData) => {
      return await apiService.post(`/company/register`, companyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    { showSuccessToast: true }
  );

  // Lấy thông tin công ty
  const getCompanyApi = useApi(
    async () => await apiService.get(`/company/mycompany`),
    { showSuccessToast: false }
  );

  // Cập nhật thông tin công ty
  const updateCompanyApi = useApi(
    async (companyData) => {
      return await apiService.put(`/company/mycompany`, companyData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    { showSuccessToast: true }
  );

  // Lấy thông tin lời mời
  const getInvitationApi = useApi(
    async (token) => await apiService.get(`/invitation/${token}`),
    { showSuccessToast: false }
  );

  // Lấy danh sách lời mời
  const getInvitationsApi = useApi(
    async (page = 0, size = 2) => await apiService.get(`/invitation?page=${page}&size=${size}`),
    { showSuccessToast: false }
  );

  // Chấp nhận lời mời
  const acceptInvitationApi = useApi(
    async (token) => {
      return await apiService.post(`/invitation/join`, null, {
        params: { token: token }
      });
    },
    { showSuccessToast: true }
  );

  // Lấy danh sách thành viên công ty
  const getCompanyMembersApi = useApi(
    async (page, size) => await apiService.get(`/company/mycompany/members?page=${page}&size=${size}`),
    { showSuccessToast: false }
  );

  // Mời thành viên
  const inviteMemberApi = useApi(
    async (email) => await apiService.post(`/invitation/invite`, { email }),
    { showSuccessToast: true }
  );

  // Lấy thông tin công ty theo ID
  const getCompanyByIdApi = useApi(
    async (id) => await apiService.get(`/company/${id}`),
    { showSuccessToast: false }
  );

  return {
    createCompany: createCompanyApi,
    getCompany: getCompanyApi,
    updateCompany: updateCompanyApi,
    getInvitation: getInvitationApi,
    getInvitations: getInvitationsApi,
    acceptInvitation: acceptInvitationApi,
    getCompanyMembers: getCompanyMembersApi,
    inviteMember: inviteMemberApi,
    getCompanyById: getCompanyByIdApi
  };
};