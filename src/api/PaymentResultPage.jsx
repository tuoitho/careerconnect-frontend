import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "./apiService";

const PaymentResultPage = () => {
  const [result, setResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");
    const txnRef = query.get("txnRef");
    const error = query.get("error");

    const handlePaymentResult = async () => {
      if (status && txnRef) {
        if (status === "success") {
          setResult({
            status: "success",
            transactionId: txnRef,
            message: "Thanh toán thành công",
          });
          toast.success("Nạp xu thành công!");
        } else {
          setResult({
            status: "failed",
            transactionId: txnRef,
            message: error === "checksum" 
              ? "Xác thực giao dịch không thành công" 
              : "Thanh toán không thành công",
          });
          toast.error("Thanh toán thất bại!");
        }
      } else {
        // Fallback check if no query params
        const storedTxnRef = localStorage.getItem("txnRef");
        if (storedTxnRef) {
          try {
            const response = await apiService.get(
              `/api/vnpay/check-status?txnRef=${storedTxnRef}`
            );
            setResult({
              status: response.data.status,
              transactionId: storedTxnRef,
              message: response.data.message,
            });
            localStorage.removeItem("txnRef");
          } catch (err) {
            setResult({
              status: "failed",
              message: "Không thể xác minh giao dịch",
            });
            toast.error("Lỗi xác minh giao dịch!");
          }
        }
      }
    };

    handlePaymentResult();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Kết quả nạp xu
        </h2>

        {result ? (
          result.status === "success" ? (
            <div>
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-green-600 text-lg mb-4">
                Nạp xu thành công!
              </p>
              <p className="text-gray-700 mb-2">
                Mã giao dịch: <span className="font-semibold">{result.transactionId}</span>
              </p>
              <p className="text-gray-600">{result.message}</p>
            </div>
          ) : (
            <div>
              <div className="text-red-600 text-4xl mb-4">✗</div>
              <p className="text-red-600 text-lg mb-4">Nạp xu thất bại!</p>
              <p className="text-gray-700">{result.message}</p>
            </div>
          )
        ) : (
          <p className="text-gray-600">Đang xử lý kết quả...</p>
        )}

        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate("/top-up")}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Nạp lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;