import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, Recruiter!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Job Postings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Job Postings</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage your current job listings</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">5</p>
            <Link 
              to="/recruiter/jobs"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Candidate Applications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Candidate Applications</h2>
            <p className="text-sm text-gray-500 mt-1">Review applications for your job postings</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">12</p>
            <Link 
              to="/recruiter/applications"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Review Applications
            </Link>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">View your recruitment metrics</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">85%</p>
            <Link 
              to="/recruiter/analytics"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}