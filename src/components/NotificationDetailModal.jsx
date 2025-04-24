import { Bell, Briefcase, Calendar, ThumbsUp, Eye, UserCheck, X } from "lucide-react";
import { useState } from "react";

// Notification detail modal component
export default function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}) {
  if (!notification) return null;

  // Function to return appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600" size={24} />
          </div>
        );
      case "interview":
        return (
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar className="text-purple-600" size={24} />
          </div>
        );
      case "recommendation":
        return (
          <div className="bg-green-100 p-3 rounded-full">
            <ThumbsUp className="text-green-600" size={24} />
          </div>
        );
      case "profile_view":
        return (
          <div className="bg-yellow-100 p-3 rounded-full">
            <Eye className="text-yellow-600" size={24} />
          </div>
        );
      case "profile_update":
        return (
          <div className="bg-red-100 p-3 rounded-full">
            <UserCheck className="text-red-600" size={24} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-full">
            <Bell className="text-gray-600" size={24} />
          </div>
        );
    }
  };

  // Function to return notification type label in Vietnamese
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "application":
        return "Ứng tuyển";
      case "interview":
        return "Phỏng vấn";
      case "recommendation":
        return "Đề xuất";
      case "profile_view":
        return "Xem hồ sơ";
      case "profile_update":
        return "Cập nhật hồ sơ";
      default:
        return "Thông báo";
    }
  };

  // Handler to mark notification as read
  const handleMarkAsRead = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <h2 className="text-xl font-semibold text-gray-800">Chi tiết thông báo</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4">
          <div className="flex items-start gap-4">
            {getNotificationIcon(notification.type)}

            <div className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      notification.read
                        ? "border border-gray-300 text-gray-500"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {notification.read ? "Đã đọc" : "Chưa đọc"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-200 px-2 py-1 rounded-md">
                    {getNotificationTypeLabel(notification.type)}
                  </span>
                  <span>{notification.time}</span>
                </div>

                <div className="mt-2 text-gray-700 border-t pt-3">
                  <p className="whitespace-pre-line">{notification.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!notification.read && onMarkAsRead && (
          <div className="flex justify-end">
            <button
              onClick={handleMarkAsRead}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Đánh dấu đã đọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}