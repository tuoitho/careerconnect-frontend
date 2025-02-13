import { CalendarDays, MapPin, Briefcase, DollarSign, Tag } from "lucide-react"  

const JobCard = ({ job }) => {  
  const formatSalary = (min, max) => {  
    return `${min && min !== "0" ? `$${min}` : ""} ${max && max !== "0" ? `- $${max}` : ""}`.trim()  
  }  

  const formatDate = (date) => {  
    return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })  
  }  

  return (  
    <div className="bg-white rounded-lg shadow-md p-4 m-2 hover:shadow-green-400 transition-shadow duration-300 border border-green-200">  
      <div className="flex justify-between items-start mb-3">  
        <div>  
          <h3 className="text-xl font-semibold text-green-600">{job.title}</h3>  
          <div className="flex items-center text-gray-600">  
            <MapPin className="w-4 h-4 mr-2 text-green-500" />  
            <p className="text-sm">{job.location}</p>  
          </div>  
        </div>  
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">  
          {job.type}  
        </span>  
      </div>  

      <div className="mb-4">  
        <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>  
      </div>  

      <div className="grid grid-cols-2 gap-3 mb-4">  
        <div className="flex items-center">  
          <DollarSign className="w-4 h-4 mr-2 text-green-500" />  
          <p className="text-sm text-gray-700">  
            <span className="font-medium text-green-700">Salary:</span> {formatSalary(job.minSalary, job.maxSalary)}  
          </p>  
        </div>  
        <div className="flex items-center">  
          <Tag className="w-4 h-4 mr-2 text-green-500" />  
          <p className="text-sm text-gray-700">  
            <span className="font-medium text-green-700">Category:</span> {job.category}  
          </p>  
        </div>  
      </div>  

      <div className="flex justify-between items-center pt-3 border-t border-green-100">  
        <div className="flex items-center text-sm text-gray-600">  
          <CalendarDays className="w-4 h-4 mr-2 text-green-500" />  
          Deadline: {formatDate(job.deadline)}  
        </div>  
        <button className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition-colors duration-300 text-sm font-medium flex items-center">  
          <Briefcase className="w-4 h-4 mr-2" />  
          Apply Now  
        </button>  
      </div>  
    </div>  
  )  
}  

export default JobCard