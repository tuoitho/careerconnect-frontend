import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loading2 from "../components/Loading2";
import { toast } from "react-toastify";
import { Turnstile } from "@marsidev/react-turnstile";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import apiService from "../api/apiService"; // Keep for Google Login API call
import { authService } from "../api/authService"; // Import authService directly
import {
  loginSuccess,
  loginFailed,
  setLoading,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthStatus
} from '../store/slices/authSlice'; // Import Redux actions and selectors
import { localStorageUtils } from '../utils/localStorage'; // Import localStorage utils

function Login() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector(selectAuthStatus);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [tk, setTk] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const turnstileRef = useRef();
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const navigate = useNavigate();
  const isLoading = authStatus === 'loading'; // Use Redux status for loading state

  const handleCaptchaSuccess = (token) => {
    setTk(token);
    setShowCaptchaModal(false);
    if (token) {
      console.log("Captcha verification succeeded, tk:", token);
      performLogin(token);
    } else {
      toast.error("Captcha verification failed. Please try again.");
      resetCaptcha(); // Reset captcha if token is unexpectedly missing
    }
  };

  const resetCaptcha = () => {
    setTk(null);
    setCaptchaKey(Date.now());
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.reset(turnstileRef.current);
    }
  };

  // Effect to redirect user based on Redux state
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role.toLowerCase() === "recruiter") {
        navigate("/recruiter");
      } else if (user.role.toLowerCase() === "admin") {
        navigate("/admin");
      }
      
      else if (user.role.toLowerCase() === "candidate") {
        navigate("/");
      } else {
        navigate("/"); // Default fallback
      }
    }
    // No navigation if not authenticated
  }, [isAuthenticated, user, navigate]);

  const performLogin = async (captchaToken) => {
    dispatch(setLoading());
    try {
      console.log("start login")
      // Assuming authService.login returns { user: ..., accessToken: ... } on success
      const response = await authService.login(formData.username, formData.password, captchaToken);

      // Check if response structure is as expected
      if (!response || !response.user || !response.accessToken) {
        console.error("Login API response structure incorrect:", response);
        throw new Error("Login failed due to unexpected server response.");
      }

      const { user, accessToken } = response;

      // Persist to localStorage
      localStorageUtils.setToken(accessToken);
      localStorageUtils.setUser(user);

      // Dispatch success action to Redux
      dispatch(loginSuccess({ user, token: accessToken }));
      toast.success("Login successful");
      // Navigation is handled by the useEffect hook now
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      dispatch(loginFailed(errorMessage));
      toast.error(errorMessage);
      resetCaptcha();
    }
    // No finally block needed as Redux state handles loading status transitions
  };

  const handleSubmit = (e) => { // No need for async here
    e.preventDefault();
    // Basic validation before showing captcha
    if (!formData.username || !formData.password) {
        toast.warn("Please enter username and password.");
        return;
    }
    setShowCaptchaModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Effect to check Turnstile readiness (keep as is)
  useEffect(() => {
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstile);
        console.log('Turnstile đã sẵn sàng');
      }
    }, 100);
    return () => clearInterval(checkTurnstile);
  }, []);

  // Handle Google Login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    dispatch(setLoading());
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token:", idToken);

      // Call backend API to verify Google token
      const res = await apiService.post("/auth/google", { idToken }, { withCredentials: true });

      // Check response structure
      if (!res || !res.user || !res.accessToken) {
          console.error("Google Login API response structure incorrect:", res);
          throw new Error("Google login failed due to unexpected server response.");
      }

      const { user, accessToken } = res;

      // Persist to localStorage
      localStorageUtils.setToken(accessToken);
      localStorageUtils.setUser(user);

      // Dispatch success action to Redux
      dispatch(loginSuccess({ user, token: accessToken }));
      toast.success("Google login successful");
      // Navigation is handled by the useEffect hook
      // window.location.reload(); // Avoid reload if possible, let React handle state updates

    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error.response?.data?.message || "Google login failed";
      dispatch(loginFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failure:", error);
    const errorMessage = "Google login failed";
    dispatch(loginFailed(errorMessage)); // Dispatch failure action
    toast.error(errorMessage);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
            {/* Username Input */}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
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

            {/* Sign In Button */}
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

            {/* Or Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              // clientId prop is handled by GoogleOAuthProvider context
              // buttonText="Login with Google" // Default text is fine
              disabled={isLoading}
              width="100%" // Make button full width if desired
              theme="outline"
              size="large"
            />
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="font-medium text-black hover:text-gray-700">
              Sign up
            </a>
          </div>
        </div>

        {/* Captcha Modal */}
        {showCaptchaModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-[320px] sm:w-[400px] max-w-[95%] relative shadow-lg border border-gray-100">
              <button
                onClick={() => !isLoading && setShowCaptchaModal(false)} // Prevent closing while loading
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                aria-label="Close verification"
                disabled={isLoading}
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
                  {isLoading ? (
                     <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                  ) : (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                      onSuccess={handleCaptchaSuccess}
                      onExpire={resetCaptcha}
                      onError={() => toast.error("Captcha challenge failed. Please try again.")} // Added onError
                      key={captchaKey}
                      className="w-full scale-[0.95] hover:scale-100 transition-transform"
                    />
                  )}
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
