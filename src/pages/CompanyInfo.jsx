const CompanyInfo = ({ company }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Address:</p>
            <p>{company.address}</p>
          </div>
          <div>
            <p className="font-medium">Website:</p>
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {company.website}
            </a>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium">Description:</p>
            <p>{company.description}</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default CompanyInfo
  
  