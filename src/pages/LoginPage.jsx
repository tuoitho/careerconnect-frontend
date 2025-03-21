import { useState, useRef, useEffect } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading2 from "../components/Loading2";
import { toast } from "react-toastify";
import { Turnstile } from "@marsidev/react-turnstile";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [tk, setTk] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const turnstileRef = useRef();
  // useEffect(() =>
  //   console.log("tk", tk)
  // , [tk]);
  const handleCaptchaSuccess = (tk) => {
    setTk(tk);
  };

  const resetCaptcha = () => {
    setTk(null);
    setCaptchaKey(Date.now());
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const navigate = useNavigate();
  const { login, error } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role.toLowerCase() === "recruiter") {
        navigate("/recruiter");
      } else if (user.role.toLowerCase() === "candidate") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    resetCaptcha();
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    login(formData, tk)
      .then((response) => {
        toast.success("Login successful");
      })
      .catch((error) => {
        toast.error(error.message);
        resetCaptcha();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-x-0 border-t-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <FiUser className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
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
              <div className="absolute right-3 top-10">
                <a onClick={() => toast.info("Tinh năng này đang được phát triển")}
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <div className="h-[50px]">
            <div className="w-full max-w-[300px] mx-auto">
              <Turnstile
                ref={turnstileRef}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onSuccess={handleCaptchaSuccess}
                onExpire={() => resetCaptcha()}
                key={captchaKey}
                className="w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !tk}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              isLoading || !tk
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

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="font-medium text-black hover:text-gray-700">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;