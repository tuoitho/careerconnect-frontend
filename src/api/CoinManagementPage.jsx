// CoinManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService";
import { toast } from "react-toastify";

const CoinManagementPage = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoinData();
  }, [page]);

  const fetchCoinData = async () => {
    setLoading(true);
    try {
      // Fetch balance
      const balanceResponse = await apiService.get("/coin-recharges/balance");
      setBalance(balanceResponse.result);

      // Fetch history
      const historyResponse = await apiService.get(
        `/coin-recharges/recharge-history?page=${page}&size=5`
      );
      setHistory(historyResponse.result.data);
      setTotalPages(historyResponse.result.totalPages);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu xu: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": // Thay COMPLETED bằng SUCCESS để khớp với JSON
        return "text-green-600";
      case "FAILED":
        return "text-red-600";
      default: // Bao gồm PENDING
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý xu</h1>

          {/* Coin Balance */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-gray-600">Số xu hiện tại</p>
              <p className="text-3xl font-semibold text-blue-600">
                {loading ? "Đang tải..." : balance.toLocaleString()} xu
              </p>
            </div>
            <button
              onClick={() => navigate("/top-up")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Nạp xu
            </button>
          </div>
        </div>

        {/* Recharge History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Lịch sử nạp xu
          </h2>

          {loading ? (
            <p className="text-gray-600">Đang tải lịch sử...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-600">Chưa có giao dịch nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Mã GD</th>
                    <th className="py-2 px-4">Số xu</th>
                    <th className="py-2 px-4">Số tiền (VND)</th>
                    <th className="py-2 px-4">Thời gian</th>
                    <th className="py-2 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="py-2 px-4">{record.id}</td>
                      <td className="py-2 px-4">{record.coinAmount}</td>
                      <td className="py-2 px-4">
                        {record.amountPaid.toLocaleString()}{" "}
                        {/* Sửa amount thành amountPaid */}
                      </td>
                      <td className="py-2 px-4">
                        {formatDate(record.createdAt)}
                      </td>
                      <td
                        className={`py-2 px-4 ${getStatusColor(record.status)}`}
                      >
                        {record.status === "SUCCESS"
                          ? "Thành công" // Sửa COMPLETED thành SUCCESS
                          : record.status === "FAILED"
                          ? "Thất bại"
                          : "Đang xử lý"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages - 1, prev + 1))
                    }
                    disabled={page === totalPages - 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinManagementPage;
