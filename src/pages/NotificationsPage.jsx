import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck, Briefcase, Calendar, ThumbsUp, Eye, UserCheck } from "lucide-react";
import apiService from "../api/apiService";
import { toast } from "react-toastify";
import NotificationDetailModal from "../components/NotificationDetailModal";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loaderRef = useRef(null);

  // Function to fetch notifications
  const fetchNotifications = useCallback(
    async (currentPage) => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        setError(null); // Reset error before API call
        const response = await apiService.get("/notifications", {
          params: { page: currentPage, size: 5 },
        });

        const newNotifications = response.result.data || [];

        setNotifications((prev) => [...prev, ...newNotifications]);
        setHasMore(newNotifications.length === 5); // If fewer than 5, no more data
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Không thể tải thêm thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    },
    [hasMore, loading]
  );

  // Fetch initial data
  useEffect(() => {
    fetchNotifications(0); // Initial fetch with page 0
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchNotifications(nextPage); // Fetch next page
            return nextPage;
          });
        }
      },
      { threshold: 0.1 } // Trigger earlier
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await apiService.put("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("Không thể đánh dấu tất cả đã đọc.");
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiService.put(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));

      // If the currently selected notification is being marked as read, update it
      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification({ ...selectedNotification, read: true });
      }

      toast.success("Đã đánh dấu thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking as read:", error);
      setError("Không thể đánh dấu đã đọc.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await apiService.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));

      // If the currently selected notification is being deleted, close the modal
      if (selectedNotification && selectedNotification.id === id) {
        setIsModalOpen(false);
        setSelectedNotification(null);
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Không thể xóa thông báo.");
      setError("Không thể xóa thông báo.");
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    // If notification is unread, mark it as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600" size={20} />
          </div>
        );
      case "interview":
        return (
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar className="text-purple-600" size={20} />
          </div>
        );
      case "recommendation":
        return (
          <div className="bg-green-100 p-3 rounded-full">
            <ThumbsUp className="text-green-600" size={20} />
          </div>
        );
      case "profile_view":
        return (
          <div className="bg-yellow-100 p-3 rounded-full">
            <Eye className="text-yellow-600" size={20} />
          </div>
        );
      case "profile_update":
        return (
          <div className="bg-red-100 p-3 rounded-full">
            <UserCheck className="text-red-600" size={20} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-full">
            <Bell className="text-gray-600" size={20} />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
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

        {notifications.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-green-50" : ""} cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4">
                  {getNotificationIcon(notification.type)}

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{notification.message}</p>

                    <div className="flex gap-4 mt-3" onClick={(e) => e.stopPropagation()}>
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-sm text-green-500 hover:text-green-600 flex items-center"
                        >
                          <Check size={14} className="mr-1" />
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {!notification.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>}
                </div>
              </div>
            ))}

            {/* Intersection Observer Target */}
            <div ref={loaderRef} className="p-4 flex justify-center">
              {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>}
              {!loading && !hasMore && notifications.length > 0 && (
                <p className="text-sm text-gray-500">Đã hiển thị tất cả thông báo</p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
};

export default NotificationsPage;