import React from 'react';
import { Link } from 'react-router-dom';
import RecruiterHeader from './RecruiterHeader';

const RecruiterLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <RecruiterHeader />

      <div className="flex">
        {/* Sidebar */}
        {/*<aside className="w-64 min-h-screen bg-white shadow-md">*/}
        {/*  <nav className="mt-5 px-2 space-y-1">*/}
        {/*    <Link */}
        {/*      to="/recruiter/dashboard"*/}
        {/*      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"*/}
        {/*    >*/}
        {/*      Dashboard*/}
        {/*    </Link>*/}
        {/*    <Link */}
        {/*      to="/recruiter/jobs"*/}
        {/*      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"*/}
        {/*    >*/}
        {/*      Job Postings*/}
        {/*    </Link>*/}
        {/*    <Link */}
        {/*      to="/recruiter/candidates"*/}
        {/*      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"*/}
        {/*    >*/}
        {/*      Candidates*/}
        {/*    </Link>*/}
        {/*  </nav>*/}
        {/*</aside>*/}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
