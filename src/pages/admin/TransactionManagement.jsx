import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchTransactions = async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getAllTransactions(page);
      setTransactions(response.result.data);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
      setCurrentPage(response.result.currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleConfirmTransaction = async (transactionId) => {
    try {
      await adminService.confirmTransaction(transactionId);
      toast.success('Xác nhận giao dịch thành công');
      fetchTransactions(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xác nhận giao dịch');
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    try {
      await adminService.cancelTransaction(transactionId);
      toast.success('Hủy giao dịch thành công');
      fetchTransactions(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi hủy giao dịch');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý giao dịch</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số coin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giao dịch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.coinAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(transaction.amountPaid)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transactionCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'PENDING' ? 'Chờ xác nhận' :
                         transaction.status === 'SUCCESS' ? 'Thành công' :
                         'Thất bại'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleConfirmTransaction(transaction.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleCancelTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hủy
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionManagement;