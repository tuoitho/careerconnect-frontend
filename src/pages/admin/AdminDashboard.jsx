import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Building2, Briefcase, CreditCard, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../../services/apiService.js';
import { toast } from 'react-toastify';
import { set } from 'date-fns';
import Loading2 from '../../components/Loading2';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState({
    fromDate: null,
    toDate: null
  });
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState('day');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    candidateCount: 0,
    recruiterCount: 0,
    totalCompanies: 0,
    verifiedCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    userRegistrationTrend: {},
    jobPostingTrend: {},
    revenueTrend: {},
    recentActivities: []
  });
  const fetchDashboardStats = async () => {
    try {
     setLoading(true);
      const params = new URLSearchParams();
      if (timeRange.fromDate) params.append('fromDate', timeRange.fromDate);
      if (timeRange.toDate) params.append('toDate', timeRange.toDate);
      params.append('groupBy', groupBy);

      const response = await apiService.get(`/admin/dashboard/stats?${params}`);
      setStats(response.result || {
        totalUsers: 0,
        activeUsers: 0,
        candidateCount: 0,
        recruiterCount: 0,
        totalCompanies: 0,
        verifiedCompanies: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        userRegistrationTrend: {},
        jobPostingTrend: {},
        revenueTrend: {},
        recentActivities: []
      });
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi');
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchDashboardStats();
  }, [timeRange, groupBy]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
          <Icon className={color.replace('border-', 'text-')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
        {loading && <Loading2 />}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Tổng số người dùng"
          value={stats.totalUsers}
          color="border-blue-500"
        />
        <StatCard
          icon={Users}
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          color="border-green-500"
        />
        <StatCard
          icon={Users}
          title="Ứng viên"
          value={stats.candidateCount}
          color="border-yellow-500"
        />
        <StatCard
          icon={Users}
          title="Nhà tuyển dụng"
          value={stats.recruiterCount}
          color="border-orange-500"
        />
        <StatCard
          icon={Building2}
          title="Tổng số công ty (Đã xác thực)"
          value={`${stats.totalCompanies} (${stats.verifiedCompanies})`}
          color="border-indigo-500"
        />
        <StatCard
          icon={Briefcase}
          title="Tổng số tin tuyển dụng (Đang hoạt động)"
          value={`${stats.totalJobs} (${stats.activeJobs})`}
          color="border-purple-500"
        />
        <StatCard
          icon={CreditCard}
          title="Tổng doanh thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(2)}M VNĐ`}
          color="border-pink-500"
        />
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
            </select>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" />
              <input
                type="date"
                value={timeRange.fromDate || ''}
                onChange={(e) => setTimeRange(prev => ({ ...prev, fromDate: e.target.value }))}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <span>đến</span>
              <input
                type="date"
                value={timeRange.toDate || ''}
                onChange={(e) => setTimeRange(prev => ({ ...prev, toDate: e.target.value }))}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Xu hướng đăng ký người dùng</h2>
            <Users className="text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatTrendData(stats.userRegistrationTrend, groupBy)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" name="Số lượng đăng ký" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Posting Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Xu hướng đăng tin tuyển dụng</h2>
            <Briefcase className="text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatTrendData(stats.jobPostingTrend, groupBy)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#10B981" name="Số lượng tin đăng" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Xu hướng doanh thu</h2>
            <CreditCard className="text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatTrendData(stats.revenueTrend, groupBy).map(({ date, value }) => ({ date, value: value / 1000000 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}M VNĐ`} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#EC4899" name="Doanh thu (triệu VNĐ)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h2>
            <Activity className="text-gray-400" />
          </div>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Chưa có hoạt động nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


const getWeekDateRange = (year, week) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstWeekday = firstDayOfYear.getDay();
  const offsetDays = firstWeekday <= 4 ? firstWeekday - 1 : firstWeekday - 8;

  const firstWeekStart = new Date(year, 0, 1 - offsetDays);
  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(weekStart.getDate() + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return `${weekStart.toLocaleDateString('vi-VN')} - ${weekEnd.toLocaleDateString('vi-VN')}`;
};

const formatTrendData = (trendData, groupBy) => {
  if (!trendData) return [];

  return Object.entries(trendData).map(([date, value]) => {
    if (groupBy === 'week') {
      const [year, week] = date.split('-').map(Number);
      return {
        date: getWeekDateRange(year, week),
        value
      };
    }
    return { date, value };
  });
};
