import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService";
import { toast } from "react-toastify";
import { CreditCard, DollarSign, ArrowLeft } from "lucide-react";

const TopUpPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Fetch current balance when component mounts
    const fetchBalance = async () => {
      try {
        const response = await apiService.get("/coin-recharges/balance");
        setBalance(response.result);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    fetchBalance();
  }, []);

  // Predefined amounts for quick selection
  const predefinedAmounts = [50, 100, 200, 500, 1000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!amount || amount < 10) {
      setError("Số tiền phải lớn hơn hoặc bằng 10");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.post(
        "/vnpay/create-payment",
        new URLSearchParams({
          coinAmount: amount,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Store transaction reference for later verification
      if (response.result && response.result.paymentUrl) {
        // Extract txnRef from URL if available, otherwise use current timestamp
        const txnRefMatch = response.result.paymentUrl.match(/vnp_TxnRef=([^&]*)/);
        const txnRef = txnRefMatch ? txnRefMatch[1] : Date.now().toString();
        localStorage.setItem("txnRef", txnRef);
        
        // Redirect to VNPay payment page
        window.location.href = response.result.paymentUrl;
      } else {
        throw new Error("Invalid payment URL");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!");
      toast.error("Không thể khởi tạo thanh toán");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectAmount = (value) => {
    setAmount(value);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <button 
            onClick={() => navigate("/coin-management")}
            className="flex items-center text-white hover:text-blue-100 transition mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Quay lại
          </button>
          <h1 className="text-2xl font-bold">Nạp xu vào tài khoản</h1>
          <p className="mt-2 text-blue-100">Nạp xu để đăng tin tuyển dụng và sử dụng các dịch vụ cao cấp</p>
        </div>

        <div className="p-6">
          {/* Current balance */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Số dư hiện tại</p>
                <p className="text-xl font-bold text-gray-800">
                  {balance !== null ? `${balance.toLocaleString()} xu` : "Đang tải..."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick amount selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn nhanh số xu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectAmount(value)}
                  className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors
                    ${amount === value 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {value} xu
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Số xu muốn nạp <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setError("");
                  }}
                  className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số xu"
                  min="10"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">xu</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Tương đương {(amount * 1000).toLocaleString()} VNĐ
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tỷ lệ quy đổi:</span>
                <span className="font-medium">1 xu = 1,000 VNĐ</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-900">Tổng thanh toán:</span>
                <span className="text-blue-600">{(amount * 1000).toLocaleString()} VNĐ</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white font-medium transition
                ${loading || !amount 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <CreditCard className="w-5 h-5" />
              {loading ? "Đang xử lý..." : "Thanh toán qua VNPay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;