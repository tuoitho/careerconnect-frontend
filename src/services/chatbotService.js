import apiService from "./apiService.js";

export const chatbotService = {
    sendMessage: async (message) => {
        return await apiService.post('/chatbot/message', { message });
    }
}