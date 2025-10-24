import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface User {
  _id: string;
  email: string;
  userType: 'creator' | 'brand';
  profile: {
    name: string;
    bio?: string;
    location?: string;
  };
  isVerified: boolean;
  createdAt: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    userType: '',
    isVerified: ''
  });
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pages: 1,
    total: 0
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, searchTerm, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.userType && { userType: filters.userType }),
        ...(filters.isVerified && { isVerified: filters.isVerified })
      });

      const response = await axios.get(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'verify' | 'unverify' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`${API_URL}/admin/users/${userId}`, {
          isVerified: action === 'verify'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(response.data.user);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users and their permissions</p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
            </div>
            
            <div className="flex gap-4">
              <label htmlFor="user-type-filter" className="sr-only">Filter by user type</label>
              <select
                id="user-type-filter"
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              >
                <option value="">All Types</option>
                <option value="creator">Creators</option>
                <option value="brand">Brands</option>
              </select>

              <label htmlFor="verification-filter" className="sr-only">Filter by verification status</label>
              <select
                id="verification-filter"
                value={filters.isVerified}
                onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.profile.name?.charAt(0) || user.email.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.profile.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.userType === 'creator' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Unverified
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => viewUserDetails(user._id)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUserAction(user._id, user.isVerified ? 'unverify' : 'verify')}
                            className={`p-1 ${user.isVerified ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.isVerified ? 'Unverify' : 'Verify'}
                          >
                            {user.isVerified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUserAction(user._id, 'delete')}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  type="button"
                  onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                  disabled={pagination.current === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                  disabled={pagination.current === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.current - 1) * 10) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.current * 10, pagination.total)}
                    </span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      type="button"
                      onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                      disabled={pagination.current === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setPagination({ ...pagination, current: page })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.current
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                      disabled={pagination.current === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close modal"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {selectedUser.profile.name?.charAt(0) || selectedUser.email.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedUser.profile.name || 'No name'}
                      </h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Type
                      </label>
                      <p className="text-gray-900 capitalize">{selectedUser.userType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <p className={`font-medium ${selectedUser.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <p className="text-gray-900">{selectedUser.profile.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joined
                      </label>
                      <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>

                  {selectedUser.profile.bio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <p className="text-gray-900">{selectedUser.profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;