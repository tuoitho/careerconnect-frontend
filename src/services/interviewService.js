import apiService from "./apiService.js";

export const interviewService = {
  getInterviewDetails: async (interviewId) => {
    return await apiService.get(`/interview/${interviewId}`);
  },
  
  joinInterview: async (interviewId) => {
    return await apiService.post(`/interview/${interviewId}/join`);
  },
  
  endInterview: async (interviewId) => {
    return await apiService.post(`/interview/${interviewId}/end`);
  },
  
  scheduleInterview: async (interviewData) => {
    return await apiService.post(`/interview/schedule`, interviewData);
  },
  
  rescheduleInterview: async (interviewId, interviewData) => {
    return await apiService.post(`/interview/${interviewId}/reschedule`, interviewData);
  },
  
  cancelInterview: async (interviewId) => {
    return await apiService.post(`/interview/${interviewId}/cancel`);
  },
  
  getInterviews: async () => {
    return await apiService.get(`/interview/list`);
  }
};