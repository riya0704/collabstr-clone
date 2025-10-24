import React, { useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  UserCheck,
  Building,
  Activity,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { stats, loading, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats?.userGrowthRate || 0}%`,
      changeType: 'positive'
    },
    {
      title: 'Total Creators',
      value: stats?.totalCreators || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      change: `${((stats?.totalCreators || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}%`,
      changeType: 'neutral'
    },
    {
      title: 'Total Brands',
      value: stats?.totalBrands || 0,
      icon: Building,
      color: 'bg-purple-500',
      change: `${((stats?.totalBrands || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}%`,
      changeType: 'neutral'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-600',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCollaborations || 0,
      icon: Activity,
      color: 'bg-orange-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Completed Campaigns',
      value: stats?.completedCollaborations || 0,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+15.3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of platform performance and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/admin/users"
                  className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                >
                  <Users className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-600">View and manage all users</p>
                  </div>
                </Link>

                <Link
                  to="/admin/collaborations"
                  className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200"
                >
                  <Briefcase className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Campaigns</h3>
                    <p className="text-sm text-gray-600">Oversee all collaborations</p>
                  </div>
                </Link>

                <Link
                  to="/admin/analytics"
                  className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200"
                >
                  <BarChart3 className="w-8 h-8 text-purple-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600">Detailed platform insights</p>
                  </div>
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-200"
                >
                  <TrendingUp className="w-8 h-8 text-orange-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Platform Settings</h3>
                    <p className="text-sm text-gray-600">Configure system settings</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Campaign completed</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New collaboration posted</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="flex items-center text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    75% Used
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;