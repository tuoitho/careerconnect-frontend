import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronRight,
  Star,
  Clock,
  FlameIcon as Fire,
  Award,
  Building,
  Eye,
} from "lucide-react"

const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [urgentJobs, setUrgentJobs] = useState([])
  const [topJobs, setTopJobs] = useState([])
  const [newJobs, setNewJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")

  const jobCategories = [
    { id: 1, name: "IT - Phần mềm", count: 1245, icon: "computer" },
    { id: 2, name: "Marketing", count: 856, icon: "megaphone" },
    { id: 3, name: "Kế toán", count: 723, icon: "calculator" },
    { id: 4, name: "Kinh doanh", count: 1102, icon: "briefcase" },
    { id: 5, name: "Nhân sự", count: 542, icon: "users" },
    { id: 6, name: "Hành chính", count: 389, icon: "clipboard" },
    { id: 7, name: "Dịch vụ khách hàng", count: 478, icon: "headset" },
    { id: 8, name: "Thiết kế", count: 356, icon: "pen-tool" },
  ]

  const topCompanies = [
    { id: 1, name: "FPT Software", logo: "/placeholder.svg?height=60&width=60", jobs: 45 },
    { id: 2, name: "Viettel", logo: "/placeholder.svg?height=60&width=60", jobs: 38 },
    { id: 3, name: "VNG Corporation", logo: "/placeholder.svg?height=60&width=60", jobs: 32 },
    { id: 4, name: "Vingroup", logo: "/placeholder.svg?height=60&width=60", jobs: 29 },
    { id: 5, name: "Samsung Vietnam", logo: "/placeholder.svg?height=60&width=60", jobs: 27 },
    { id: 6, name: "Momo", logo: "/placeholder.svg?height=60&width=60", jobs: 24 },
  ]

  const locations = [
    { id: 1, name: "Hà Nội", count: 2456 },
    { id: 2, name: "Hồ Chí Minh", count: 3254 },
    { id: 3, name: "Đà Nẵng", count: 845 },
    { id: 4, name: "Hải Phòng", count: 423 },
    { id: 5, name: "Cần Thơ", count: 312 },
    { id: 6, name: "Bình Dương", count: 289 },
  ]

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      // In a real app, you would call your API
      // Simulating API response with mock data
      setTimeout(() => {
        setFeaturedJobs(generateMockJobs(8, true))
        setUrgentJobs(generateMockJobs(4, false, true))
        setTopJobs(generateMockJobs(6))
        setNewJobs(generateMockJobs(6, false, false, true))
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setLoading(false)
    }
  }

  const generateMockJobs = (count, isFeatured = false, isUrgent = false, isNew = false) => {
    const jobTypes = ["Full-time", "Part-time", "Remote", "Freelance"]
    const titles = [
      "Frontend Developer",
      "Backend Engineer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Product Manager",
      "DevOps Engineer",
      "Data Analyst",
      "Mobile Developer",
      "QA Engineer",
      "Project Manager",
      "Marketing Specialist",
      "HR Manager",
      "Accountant",
      "Sales Executive",
      "Customer Service",
    ]
    const companies = [
      { name: "Tech Solutions", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Digital Innovations", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Future Systems", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Creative Tech", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Global Software", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Smart Solutions", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Viet Solutions", logo: "/placeholder.svg?height=50&width=50" },
      { name: "Tech Innovate", logo: "/placeholder.svg?height=50&width=50" },
    ]
    const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương"]

    return Array(count)
      .fill()
      .map((_, index) => ({
        id: Math.floor(Math.random() * 1000) + 1,
        title: titles[Math.floor(Math.random() * titles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        salary: ["15-20 triệu", "20-25 triệu", "25-30 triệu", "30-40 triệu", "Thỏa thuận"][
          Math.floor(Math.random() * 5)
        ],
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(
          "vi-VN",
        ),
        isFeatured: isFeatured || Math.random() > 0.7,
        isUrgent: isUrgent || Math.random() > 0.8,
        isNew: isNew || Math.random() > 0.8,
        views: Math.floor(Math.random() * 500) + 100,
      }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real app, you would redirect to search results page with query params
    window.location.href = `/jobs?search=${searchTerm}&location=${location}`
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Tìm kiếm công việc mơ ước của bạn</h1>
            <p className="text-green-100 text-lg">Hơn 50,000+ cơ hội việc làm đang chờ đợi bạn</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo chức danh, kỹ năng, công ty..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="md:w-1/3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Địa điểm"
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Featured Jobs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Việc làm nổi bật
            </h2>
            <Link to="/jobs" className="text-green-600 hover:text-green-700 flex items-center">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={job.company.logo || "/placeholder.svg"}
                        alt={job.company.name}
                        className="w-12 h-12 object-contain border border-gray-200 rounded-md mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-green-600 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.postedDate}</span>
                      <div className="flex items-center">
                        {job.isUrgent && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-red-100 text-red-800 mr-1">
                            Gấp
                          </span>
                        )}
                        {job.isNew && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-800">
                            Mới
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {job.isFeatured && (
                    <div className="bg-yellow-500 text-white text-xs font-medium py-1 px-2 text-center">
                      Việc làm nổi bật
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Urgent Hiring Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Fire className="h-6 w-6 text-red-500 mr-2" />
              Tuyển dụng gấp
            </h2>
            <Link to="/jobs?urgent=true" className="text-green-600 hover:text-green-700 flex items-center">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {urgentJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group border-2 border-red-100"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={job.company.logo || "/placeholder.svg"}
                        alt={job.company.name}
                        className="w-12 h-12 object-contain border border-gray-200 rounded-md mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-green-600 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.postedDate}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-red-100 text-red-800">
                        Gấp
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Jobs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Award className="h-6 w-6 text-blue-500 mr-2" />
              Việc làm tốt nhất
            </h2>
            <Link to="/jobs?top=true" className="text-green-600 hover:text-green-700 flex items-center">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={job.company.logo || "/placeholder.svg"}
                        alt={job.company.name}
                        className="w-12 h-12 object-contain border border-gray-200 rounded-md mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800 group-hover:text-green-600 line-clamp-1 mr-2">
                            {job.title}
                          </h3>
                          <Award className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.postedDate}</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {job.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* New Jobs Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Clock className="h-6 w-6 text-green-500 mr-2" />
              Việc làm mới nhất
            </h2>
            <Link to="/jobs?new=true" className="text-green-600 hover:text-green-700 flex items-center">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newJobs.map((job) => (
                <Link
                  to={`/jobs/${job.id}`}
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={job.company.logo || "/placeholder.svg"}
                        alt={job.company.name}
                        className="w-12 h-12 object-contain border border-gray-200 rounded-md mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-green-600 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.postedDate}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-800">
                        Mới
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Job Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Briefcase className="h-6 w-6 text-gray-600 mr-2" />
              Việc làm theo ngành nghề
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobCategories.map((category) => (
              <Link
                to={`/jobs?category=${category.id}`}
                key={category.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} việc làm</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Top Companies Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Building className="h-6 w-6 text-purple-600 mr-2" />
              Nhà tuyển dụng hàng đầu
            </h2>
            <Link to="/companies" className="text-green-600 hover:text-green-700 flex items-center">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topCompanies.map((company) => (
              <Link
                to={`/companies/${company.id}`}
                key={company.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
              >
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="w-16 h-16 object-contain mx-auto mb-3"
                />
                <h3 className="font-medium text-gray-800 text-sm mb-1">{company.name}</h3>
                <p className="text-xs text-gray-500">{company.jobs} việc làm</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Jobs by Location Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MapPin className="h-6 w-6 text-red-500 mr-2" />
              Việc làm theo địa điểm
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((location) => (
              <Link
                to={`/jobs?location=${location.name}`}
                key={location.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-1">{location.name}</h3>
                <p className="text-xs text-gray-500">{location.count} việc làm</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bạn là nhà tuyển dụng?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Đăng tin tuyển dụng ngay hôm nay để tiếp cận hàng ngàn ứng viên tiềm năng cho doanh nghiệp của bạn.
          </p>
          <Link
            to="/employers/register"
            className="inline-block bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-md font-medium"
          >
            Đăng tin tuyển dụng
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage

