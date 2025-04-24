import { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function GoogleLoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sử dụng hook từ @react-oauth/google
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // 1. Lấy thông tin người dùng từ Google bằng access token
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        // 2. Gửi access token và thông tin user đến backend để xác thực
        const response = await axios.post('http://localhost:8088/api/auth/google-login', {
          token: tokenResponse.access_token,
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture
        }, {
          withCredentials: true // Để nhận cookies từ backend
        });
        
        // 3. Lưu token và thông tin người dùng từ backend
        const { accessToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // 4. Cập nhật thông tin đăng nhập trong app
        // Giả sử bạn có context hoặc Redux để lưu trạng thái đăng nhập
        login(user);
        
        toast.success('Google login successful');
        navigate('/');
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(error.response?.data?.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      toast.error('Google login failed');
    }
  });

  return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white ${
        isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
      } transition-colors`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            {/* SVG path cho logo Google */}
          </svg>
          Login with Google
        </div>
      )}
    </button>
  );
}

export default GoogleLoginComponent;

