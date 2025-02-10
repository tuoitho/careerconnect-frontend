
import { useState, useEffect } from "react"
import JobListItem from "../components/JobListItem"
import Pagination from "../components/Pagination"

const CompanyJobs = ({ companyId }) => {
  const [jobs, setJobs] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    // For this example, we'll use the provided data
    const fetchJobs = async () => {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = {
        code: 200,
        message: "Jobs retrieved successfully",
        result: {
          currentPage: 0,
          pageSize: 4,
          totalPages: 2,
          totalElements: 5,
          data: [
            {
              jobId: 5,
              title: "Software Engineer2",
              description: "Develop software solutions.",
              location: "New York, NY",
              type: "FULL_TIME",
              minSalary: "70000",
              maxSalary: "120000",
              created: "2025-01-29T16:17:47.594683",
              updated: "2025-01-29T16:17:58.663482",
              deadline: "2025-12-31T23:59:59",
              experience: null,
              category: "Software",
              active: true,
            },
            {
              jobId: 7,
              title: "Job Title*",
              description: "Description",
              location: "Location*",
              type: "FULL_TIME",
              minSalary: "1000",
              maxSalary: "2222",
              created: "2025-02-04T16:51:58.68872",
              updated: "2025-02-04T16:51:58.68872",
              deadline: "2024-11-11T11:11:00",
              experience: null,
              category: "HEALTHCARE",
              active: true,
            },
            {
              jobId: 8,
              title: "Job Title*",
              description: "Description",
              location: "Location*",
              type: "FULL_TIME",
              minSalary: "1000",
              maxSalary: "2222",
              created: "2025-02-04T16:53:20.772346",
              updated: "2025-02-04T16:53:20.772346",
              deadline: "2024-12-11T11:11:00",
              experience: null,
              category: "IT",
              active: true,
            },
            {
              jobId: 9,
              title: "Job Title*",
              description: "Job Title*",
              location: "Job Title*",
              type: "FULL_TIME",
              minSalary: "1000",
              maxSalary: "2222",
              created: "2025-02-04T17:02:57.501696",
              updated: "2025-02-04T17:02:57.501696",
              deadline: "2002-02-22T22:02:00",
              experience: null,
              category: "FINANCE",
              active: true,
            },
          ],
        },
      }

      setJobs(response.result.data)
      setCurrentPage(response.result.currentPage)
      setTotalPages(response.result.totalPages)
    }

    fetchJobs()
  }, []) // Removed companyId from dependency array

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // In a real application, you would fetch the new page data here
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <JobListItem key={job.jobId} job={job} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default CompanyJobs

