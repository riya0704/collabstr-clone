import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DashboardStats {
  totalEarnings?: number;
  activeCollaborations?: number;
  completedCollaborations?: number;
  totalApplications?: number;
  profileViews?: number;
  totalCampaigns?: number;
  activeCampaigns?: number;
  totalSpent?: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'collaboration' | 'message' | 'payment';
  title: string;
  description: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      if (user?.userType === 'creator') {
        setStats({
          totalEarnings: 12450,
          activeCollaborations: 3,
          completedCollaborations: 28,
          totalApplications: 45,
          profileViews: 1250
        });
        
        setRecentActivity([
          {
            id: '1',
            type: 'application',
            title: 'Application Approved',
            description: 'Your application for "Summer Fashion Campaign" has been approved!',
            date: '2024-01-15',
            status: 'approved'
          },
          {
            id: '2',
            type: 'collaboration',
            title: 'Collaboration Completed',
            description: 'Successfully completed "Fitness Challenge Partnership"',
            date: '2024-01-14',
            status: 'completed'
          },
          {
            id: '3',
            type: 'message',
            title: 'New Message',
            description: 'Fashion Nova sent you a message about your application',
            date: '2024-01-13'
          }
        ]);
      } else {
        setStats({
          totalCampaigns: 12,
          activeCampaigns: 5,
          totalSpent: 25600,
          totalApplications: 156
        });
        
        setRecentActivity([
          {
            id: '1',
            type: 'application',
            title: 'New Application',
            description: 'Sarah Johnson applied to your "Summer Collection Campaign"',
            date: '2024-01-15',
            status: 'pending'
          },
          {
            id: '2',
            type: 'collaboration',
            title: 'Campaign Launched',
            description: 'Your "Holiday Lookbook Creation" campaign is now live',
            date: '2024-01-14',
            status: 'approved'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-5 h-5 text-primary-600" />;
      case 'collaboration':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.profile.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.userType === 'creator' 
                ? 'Track your collaborations and earnings' 
                : 'Manage your campaigns and find creators'
              }
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              {user?.userType === 'creator' ? 'Update Profile' : 'New Campaign'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.userType === 'creator' ? (
            <>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings?.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Collaborations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeCollaborations}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedCollaborations}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.profileViews?.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeCampaigns}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalSpent?.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications Received</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                        <div className="flex items-center space-x-2">
                          {activity.status && getStatusIcon(activity.status)}
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user?.userType === 'creator' ? (
                  <>
                    <button className="w-full btn-primary text-sm py-3">
                      Browse New Opportunities
                    </button>
                    <button className="w-full btn-secondary text-sm py-3">
                      Update Portfolio
                    </button>
                    <button className="w-full btn-secondary text-sm py-3">
                      View Analytics
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full btn-primary text-sm py-3">
                      Create New Campaign
                    </button>
                    <button className="w-full btn-secondary text-sm py-3">
                      Find Creators
                    </button>
                    <button className="w-full btn-secondary text-sm py-3">
                      View Applications
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {user?.userType === 'creator' ? 'Earnings Overview' : 'Campaign Performance'}
              </h3>
              <div className="h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chart coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;