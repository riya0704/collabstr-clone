import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Star,
  Clock,
  Eye,
  MessageCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue?: number;
    totalSpent?: number;
    totalOrders: number;
    completedOrders: number;
    activeServices?: number;
    averageRating?: number;
    averageOrderValue?: number;
    successRate?: number;
  };
  chartData: Array<{
    _id: {
      year: number;
      month: number;
      day?: number;
    };
    value: number;
    count: number;
  }>;
  topServices?: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  topCategories?: Array<{
    _id: string;
    spent: number;
    orders: number;
  }>;
}

interface PerformanceMetrics {
  totalServices?: number;
  activeServices?: number;
  totalOrders: number;
  completedOrders: number;
  averageRating?: number;
  totalViews?: number;
  conversionRate?: number;
  responseTime?: number;
  totalSpent?: number;
  averageOrderValue?: number;
  successRate?: number;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnalytics();
    fetchPerformanceMetrics();
  }, [period, dateRange]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams({
        period,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate })
      });

      const response = await axios.get(`${API_URL}/analytics/dashboard?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/performance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setPerformanceMetrics(response.data);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your performance and insights</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.overview.totalOrders || 0}
                </p>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.userType === 'creator' ? 'Revenue' : 'Total Spent'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${user?.userType === 'creator' 
                    ? (analyticsData?.overview.totalRevenue || 0).toLocaleString()
                    : (analyticsData?.overview.totalSpent || 0).toLocaleString()
                  }
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((analyticsData?.overview.successRate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analyticsData?.overview.averageRating || 0).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="text-center py-12 text-gray-500">
              <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
