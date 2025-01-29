import React from "react"
import { Link } from "react-router-dom"
import { FaBuilding, FaUsers, FaFileAlt } from "react-icons/fa"

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4 fixed left-0 top-16">
      <h2 className="text-2xl font-bold mb-6">Company Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/recruiter/company" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaBuilding className="mr-2" />
              Company Information
            </Link>
          </li>
          <li>
            <Link to="/recruiter/company/members" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-2" />
              Manage Members
            </Link>
          </li>
          <li>
            <Link to="/recruiter/company/jobs" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaFileAlt className="mr-2" />
              Manage Job Postings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar