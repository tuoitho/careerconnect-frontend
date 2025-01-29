import React from 'react';
import { Link } from 'react-router-dom';
import RecruiterHeader from './RecruiterHeader';
import Sidebar from './Sidebar';

const RecruiterLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <RecruiterHeader />
      <Sidebar />
      <div className="flex pt-14 pl-64">
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