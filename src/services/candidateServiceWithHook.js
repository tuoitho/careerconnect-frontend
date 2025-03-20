import { useApi } from '../hooks/useApi';
import apiService from '../api/apiService';

export const useCandidateService = () => {
  // Lấy thông tin profile của ứng viên
  const getCandidateProfileApi = useApi(
    async () => await apiService.get(`/candidate/profile/me`),
    { showSuccessToast: false }
  );

  // Lấy chi tiết ứng viên theo ID
  const getCandidateDetailApi = useApi(
    async (candidateId) => await apiService.get(`/candidate/profile/${candidateId}`),
    { showSuccessToast: false }
  );

  // Cập nhật profile ứng viên
  const updateCandidateProfileApi = useApi(
    async (candidateProfile) => {
      return await apiService.put(`/candidate/profile/me`, candidateProfile, {
        headers: {
          'Content-Type': 'application/multipart/form-data'
        }
      });
    },
    { showSuccessToast: true }
  );

  // Upload CV
  const uploadCVApi = useApi(
    async (formData) => {
      return await apiService.post(`/candidate/profile/cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    { showSuccessToast: true }
  );

  // Xóa CV
  const deleteCVApi = useApi(
    async (cvId) => await apiService.delete(`/candidate/profile/cv/${cvId}`),
    { showSuccessToast: true }
  );

  return {
    getCandidateProfile: getCandidateProfileApi,
    getCandidateDetail: getCandidateDetailApi,
    updateCandidateProfile: updateCandidateProfileApi,
    uploadCV: uploadCVApi,
    deleteCV: deleteCVApi
  };
};