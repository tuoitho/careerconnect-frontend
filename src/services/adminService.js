import apiService from "../api/apiService";

export const adminService = {
  // User management
  async getAllUsers(page = 0, size = 10) {
    return await apiService.get(`/admin/users?page=${page}&size=${size}`);
  },

  async getUserDetail(userId) {
    return await apiService.get(`/admin/users/${userId}`);
  },

  async lockUser(userId) {
    return await apiService.put(`/admin/users/${userId}/lock`);
  },

  async unlockUser(userId) {
    return await apiService.put(`/admin/users/${userId}/unlock`);
  },

  // Company management 
  async getAllCompanies(page = 0, size = 10) {
    return await apiService.get(`/admin/companies?page=${page}&size=${size}`);
  },

  async approveCompany(companyId) {
    return await apiService.put(`/admin/companies/${companyId}/approve`);
  },

  async lockCompany(companyId) {
    return await apiService.put(`/admin/companies/${companyId}/lock`);
  },

  // Job management
  async getAllJobs(page = 0, size = 10) {
    return await apiService.get(`/admin/jobs?page=${page}&size=${size}`);
  },

  async approveJob(jobId) {
    return await apiService.put(`/admin/jobs/${jobId}/approve`);
  },

  async hideJob(jobId) {
    return await apiService.put(`/admin/jobs/${jobId}/hide`);
  },

  // Transaction management
  async getAllTransactions(page = 0, size = 10) {
    return await apiService.get(`/admin/transactions?page=${page}&size=${size}`);
  },

  async confirmTransaction(transactionId) {
    return await apiService.put(`/admin/transactions/${transactionId}/confirm`);
  },

  async cancelTransaction(transactionId) {
    return await apiService.put(`/admin/transactions/${transactionId}/cancel`);
  }
};