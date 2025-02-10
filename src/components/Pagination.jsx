const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center items-center mt-8">
        <button
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="mx-4">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    )
  }
  
  export default Pagination
  
  