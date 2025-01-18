export const authApi = {
    login: async (credentials) => {
      // Đây là nơi bạn sẽ gọi API đăng nhập thực tế
      // Ví dụ:
      const response = await fetch('http://example.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
  };
  