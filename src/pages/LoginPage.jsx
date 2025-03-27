import { useState, useRef, useEffect, useContext } from "react";
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import apiService from "../api/apiService";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);
  const [tk, setTk] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const turnstileRef = useRef();
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCaptchaSuccess = (tk) => {
    setTk(tk);
    setTimeout(() => {
      setShowCaptchaModal(false);
      if (tk) {
        console.log("Captcha verification succeeded, tk:", tk);
        performLogin(tk);
      }
    }, 1000);
  };

  const resetCaptcha = () => {
    setTk(null);
    setCaptchaKey(Date.now());
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.reset(turnstileRef.current);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      if (user.role.toLowerCase() === "recruiter") {
        navigate("/recruiter");
      } else if (user.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else if (user.role.toLowerCase() === "candidate") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const performLogin = (tk) => {
    setIsLoading(true);
    login(formData, tk)
      .then((response) => {
        toast.success("Login successful");
      })
      .catch((error) => {
        toast.error(error.message || "Login failed");
        resetCaptcha();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowCaptchaModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstile);
        console.log("Turnstile đã sẵn sàng");
      }
    }, 100);
    return () => clearInterval(checkTurnstile);
  }, []);

  // Xử lý Google Login từ frontend
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const idToken = credentialResponse.credential; // Lấy id_token từ Google
      console.log("Google ID Token:", idToken);

      // Gửi idToken đến backend để xác minh
      // gửi 1 lần trc xong tự cancel với timeout=0

    
      const res = await apiService.post("/auth/google", {
        idToken,
      }, {
       withCredentials: true, 
      }
      );
      

      localStorage.setItem("authToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      // toast.success("Google login successful");
      //cập nhật auth context
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google login failed");
    setIsLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId="952720183712-fiqpqldbvcm0goorgu3okv85chlgrp59.apps.googleusercontent.com">

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-x-0 border-t-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <FiUser className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div></div>
            <a
              onClick={() => toast.info("Tính năng này đang được phát triển")}
              href="#"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                : "bg-black hover:bg-gray-800"
            } transition-colors duration-200 group relative`}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Sign in</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            disabled={isLoading}
          />
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <a href="/register" className="font-medium text-black hover:text-gray-700">
            Sign up
          </a>
        </div>
      </div>

      {showCaptchaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-[320px] sm:w-[400px] max-w-[95%] relative shadow-lg border border-gray-100">
            <button
              onClick={() => setShowCaptchaModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Close verification"
            >
              <FiX className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>

            <div className="space-y-5 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Security Check</h3>
                <p className="text-sm text-gray-600 px-2 leading-relaxed">
                  Verify you're human to continue
                </p>
              </div>

              <div className="min-h-[78px] flex items-center justify-center py-2">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={handleCaptchaSuccess}
                  onExpire={resetCaptcha}
                  key={captchaKey}
                  className="w-full scale-[0.95] hover:scale-100 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </GoogleOAuthProvider>
  );
}

export default Login;