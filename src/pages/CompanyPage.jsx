import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompanyJobs from "./CompanyJobs";
import CompanyInfo from "./CompanyInfo";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import Loading2 from "../components/Loading2";

const CompanyReviews = ({ companyId }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Company Reviews</h2>
    <p>This is where company reviews would be displayed.</p>
  </div>
);

const CompanyBenefits = ({ companyId }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
    <p>This is where company benefits would be displayed.</p>
  </div>
);

const CompanyPage = () => {
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [isTabTopRight, setIsTabTopRight] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await companyService.getCompanyById(companyId);
        setCompanyData(response.result);
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading company: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsTabTopRight(tab !== "info");
  };

  if (loading) return <Loading2 />;
  if (error || !companyData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-red-600">{error || "Failed to load company information"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50 relative">
      <div className="flex items-center mb-8 transition-all duration-700 ease-in-out">
        <div className="logo-container mr-8">
          <img
            src={companyData.logo || "/placeholder.svg"}
            alt={companyData.name}
            className={`company-logo rounded-full ${
              isTabTopRight ? "small" : "large"
            }`}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">{companyData.name}</h1>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes logoGlow {
          0%, 100% {
            box-shadow: 0 0 0 10px rgba(245, 157, 11, 0.1);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(245, 157, 11, 0.2);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px; /* Reduced space for the glow effect */
          transition: padding 0.7s ease-in-out;
        }
        .company-logo {
          border: 3px solid #f59e0b;
          box-shadow: 0 0 0 10px rgba(245, 157, 11, 0.1);
          animation: logoGlow 2s infinite;
          transition: width 0.7s ease-in-out, height 0.7s ease-in-out;
        }
        .company-logo.large {
          width: 120px;
          height: 120px;
        }
        .company-logo.small {
          width: 80px;
          height: 80px;
        }
        .tab-container {
          position: relative;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in-out;
          z-index: 10;
        }
        .tab-container.initial {
          transform: translateY(0) translateX(0) scale(1);
          opacity: 1;
          margin-bottom: 1.5rem;
        }
        .tab-container.top-right {
          transform: translateY(-120px) translateX(50%) scale(0.95);
          opacity: 0.95;
        }
        .content-container {
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .content-container.initial {
          transform: translateY(0);
        }
        .content-container.shift-up {
          transform: translateY(-80px);
        }
      `}</style>

      {/* Tabs */}
      <div
        className={`tab-container flex flex-wrap gap-2 ${
          isTabTopRight ? "top-right" : "initial"
        }`}
      >
        <button
          className={`px-6 py-3 rounded-l-md font-medium transition-all duration-300 ease-in-out ${
            activeTab === "info"
              ? "bg-green-600 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102 hover:shadow-sm"
          }`}
          onClick={() => handleTabClick("info")}
        >
          Company Info
        </button>
        <button
          className={`px-6 py-3 font-medium transition-all duration-300 ease-in-out ${
            activeTab === "jobs"
              ? "bg-green-600 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102 hover:shadow-sm"
          }`}
          onClick={() => handleTabClick("jobs")}
        >
          Posted Jobs
        </button>
        <button
          className={`px-6 py-3 font-medium transition-all duration-300 ease-in-out ${
            activeTab === "reviews"
              ? "bg-green-600 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102 hover:shadow-sm"
          }`}
          onClick={() => handleTabClick("reviews")}
        >
          Reviews
        </button>
        <button
          className={`px-6 py-3 rounded-r-md font-medium transition-all duration-300 ease-in-out ${
            activeTab === "benefits"
              ? "bg-green-600 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102 hover:shadow-sm"
          }`}
          onClick={() => handleTabClick("benefits")}
        >
          Benefits
        </button>
      </div>

      {/* Content */}
      <div
        className={`content-container bg-white rounded-lg shadow-lg p-6 transition-all duration-700 ease-in-out ${
          isTabTopRight ? "shift-up" : "initial"
        }`}
        style={{ animation: "fadeIn 0.7s ease-in-out" }}
      >
        {activeTab === "info" && <CompanyInfo company={companyData} />}
        {activeTab === "jobs" && <CompanyJobs companyId={companyId} />}
        {activeTab === "reviews" && <CompanyReviews companyId={companyId} />}
        {activeTab === "benefits" && <CompanyBenefits companyId={companyId} />}
      </div>
    </div>
  );
};

export default CompanyPage;