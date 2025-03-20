import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { jobService } from "../services/jobService";
const CompanyJobs = ({ companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // {{base_url}}/candidate/jobs?companyId=5&page=0&size=4
  const fetchJobs = async () => {
    try{
      setLoading(true);
    const response = await jobService.getCompanyJobs(companyId, currentPage);
    setJobs(response.result.data);
    // setCurrentPage(response.result.currentPage);
    setTotalPages(response.result.totalPages);
    }
    catch(error){
    }
    finally{

      setLoading(false);
    }
  }


  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">  
      <h2 className="text-3xl font-bold mb-4 text-center">Posted Jobs</h2>
      
      <div className="flex flex-col gap-2">  
        {jobs.map((job) => (
          <JobCard key={job.jobId} job={job} className="p-2"
          
          
          />
        ))}
      </div>

      <Pagination   
        currentPage={currentPage}   
        totalPages={totalPages}   
        onPageChange={handlePageChange}   
      />  
    </div>  
  );
};

export default CompanyJobs;
