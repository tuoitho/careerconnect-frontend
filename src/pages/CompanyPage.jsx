import { useState, useEffect } from "react"
import CompanyJobs from "./CompanyJobs"
import CompanyInfo from "./CompanyInfo"
const CompanyPage = ({ companyId }) => {
  const [activeTab, setActiveTab] = useState("info")
  const [companyData, setCompanyData] = useState(null)

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    // For this example, we'll use the provided data
    const fetchCompanyData = async () => {
      // Simulating an API call
      // await new Promise((resolve) => setTimeout(resolve, 500))

      const response = {
        code: 200,
        message: "Company retrieved successfully",
        result: {
          companyId: 5,
          name: "à",
          address: "âf",
          website: "https://example.com",
          description: "âf",
          logo: "http://res.cloudinary.com/dd7r5ktuy/image/upload/v1738132062/buiavz3bb0nax1zzvhji.jpg",
          active: true,
        },
      }

      setCompanyData(response.result)
    }

    fetchCompanyData()
  }, [])

  if (!companyData) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6 ">
        <img
          src={companyData.logo || "/placeholder.svg"}
          alt={companyData.name}
          className="w-16 h-16 rounded-full mr-4"
        />
        <h1 className="text-3xl font-bold">{companyData.name}</h1>
      </div>
      <div className="mb-6">
        <button
          className={`px-4 py-2 mr-2 rounded ${activeTab === "info" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("info")}
        >
          Company Info
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "jobs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("jobs")}
        >
          Posted Jobs
        </button>
      </div>
      {activeTab === "info" ? <CompanyInfo company={companyData} /> : <CompanyJobs companyId={companyData.companyId} />}
    </div>
  )
}

export default CompanyPage

