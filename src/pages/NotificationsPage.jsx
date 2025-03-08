
import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, Briefcase, Calendar, ThumbsUp, Eye, UserCheck } from "lucide-react"
import Loading2 from "../components/Loading2"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: "Ứng tuyển thành công",
          message: "Bạn đã ứng tuyển thành công vào vị trí Frontend Developer tại ABC Company",
          time: "15/03/2025 - 10:30",
          isRead: false,
          type: "application",
        },
        {
          id: 2,
          title: "Phỏng vấn mới",
          message: "Bạn có lịch phỏng vấn mới vào ngày 15/03/2025 với XYZ Corp",
          time: "14/03/2025 - 15:45",
          isRead: false,
          type: "interview",
        },
        {
          id: 3,
          title: "Việc làm phù hợp",
          message: "Chúng tôi tìm thấy 5 việc làm phù hợp với kỹ năng của bạn",
          time: "12/03/2025 - 09:15",
          isRead: true,
          type: "recommendation",
        },
        {
          id: 4,
          title: "Nhà tuyển dụng đã xem hồ sơ",
          message: "Tech Solutions đã xem hồ sơ của bạn",
          time: "10/03/2025 - 14:20",
          isRead: true,
          type: "profile_view",
        },
        {
          id: 5,
          title: "Cập nhật hồ sơ",
          message: "Vui lòng cập nhật hồ sơ của bạn để tăng cơ hội được tuyển dụng",
          time: "08/03/2025 - 11:00",
          isRead: true,
          type: "profile_update",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600" size={20} />
          </div>
        )
      case "interview":
        return (
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar className="text-purple-600" size={20} />
          </div>
        )
      case "recommendation":
        return (
          <div className="bg-green-100 p-3 rounded-full">
            <ThumbsUp className="text-green-600" size={20} />
          </div>
        )
      case "profile_view":
        return (
          <div className="bg-yellow-100 p-3 rounded-full">
            <Eye className="text-yellow-600" size={20} />
          </div>
        )
      case "profile_update":
        return (
          <div className="bg-red-100 p-3 rounded-full">
            <UserCheck className="text-red-600" size={20} />
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-full">
            <Bell className="text-gray-600" size={20} />
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
            {/* {loading && <Loading2 />} */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="text-green-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Thông báo của bạn</h1>
          </div>

          <button
            onClick={markAllAsRead}
            className="text-green-500 hover:text-green-600 text-sm font-medium flex items-center"
          >
            <CheckCheck size={16} className="mr-1" />
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-green-50" : ""}`}
              >
                <div className="flex gap-4">
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>

                    <div className="flex gap-4 mt-3">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-green-500 hover:text-green-600 flex items-center"
                        >
                          <Check size={14} className="mr-1" />
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {!notification.isRead && <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage

