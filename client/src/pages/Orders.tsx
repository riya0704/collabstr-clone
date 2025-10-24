import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Download,
  Star,
  Filter,
  Search,
  Calendar,
  User,
  Package
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Order {
  _id: string;
  orderNumber: string;
  service: {
    _id: string;
    title: string;
    category: string;
  };
  creator: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  brand: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
    brandProfile?: {
      companyName: string;
    };
  };
  status: string;
  pricing: {
    amount: number;
    platformFee: number;
    creatorEarnings: number;
  };
  timeline: {
    orderPlaced?: string;
    paymentConfirmed?: string;
    workStarted?: string;
    delivered?: string;
    completed?: string;
    deadline: string;
  };
  deliverables: Array<{
    type: string;
    content: string;
    uploadedAt: string;
  }>;
  rating?: {
    score: number;
    review: string;
    reviewedAt: string;
  };
  createdAt: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    dateRange: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  const statusConfig = {
    pending_payment: { color: 'yellow', label: 'Pending Payment', icon: Clock },
    payment_confirmed: { color: 'blue', label: 'Payment Confirmed', icon: CheckCircle },
    in_progress: { color: 'blue', label: 'In Progress', icon: Clock },
    delivered: { color: 'green', label: 'Delivered', icon: Package },
    revision_requested: { color: 'orange', label: 'Revision Requested', icon: AlertCircle },
    completed: { color: 'green', label: 'Completed', icon: CheckCircle },
    cancelled: { color: 'red', label: 'Cancelled', icon: XCircle },
    disputed: { color: 'red', label: 'Disputed', icon: AlertCircle }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, pagination.current]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '10',
        ...(filter.status && { status: filter.status }),
        ...(filter.search && { search: filter.search })
      });

      const response = await axios.get(`${API_URL}/orders/my-orders?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, message?: string) => {
    try {
      await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleRating = async (orderId: string, rating: number, review: string) => {
    try {
      await axios.post(
        `${API_URL}/orders/${orderId}/rating`,
        { rating, review },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      fetchOrders();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.color : 'gray';
  };

  const getStatusLabel = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.label : status;
  };

  const canPerformAction = (order: Order, action: string) => {
    const isCreator = user?.userType === 'creator' && order.creator._id === user.id;
    const isBrand = user?.userType === 'brand' && order.brand._id === user.id;

    switch (action) {
      case 'accept':
        return isCreator && order.status === 'pending_payment';
      case 'start':
        return isCreator && order.status === 'payment_confirmed';
      case 'deliver':
        return isCreator && order.status === 'in_progress';
      case 'complete':
        return isBrand && order.status === 'delivered';
      case 'request_revision':
        return isBrand && order.status === 'delivered';
      case 'rate':
        return isBrand && order.status === 'completed' && !order.rating;
      default:
        return false;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.service.title.toLowerCase().includes(searchTerm) ||
        (user?.userType === 'brand' 
          ? order.creator.profile.name.toLowerCase().includes(searchTerm)
          : order.brand.profile.name.toLowerCase().includes(searchTerm)
        )
      );
    }
    return true;
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            {user?.userType === 'creator' 
              ? 'Manage your client orders and deliverables'
              : 'Track your orders and collaborate with creators'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              >
                <option value="">All Statuses</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {user?.userType === 'creator' 
                  ? "You haven't received any orders yet. Make sure your services are active and optimized."
                  : "You haven't placed any orders yet. Browse our talented creators to get started."
                }
              </p>
              <Link
                to={user?.userType === 'creator' ? '/services' : '/creators'}
                className="btn-primary"
              >
                {user?.userType === 'creator' ? 'View Services' : 'Browse Creators'}
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
              const otherParty = user?.userType === 'creator' ? order.brand : order.creator;
              
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          {otherParty.profile.avatar ? (
                            <img
                              src={otherParty.profile.avatar}
                              alt={otherParty.profile.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold">
                              {otherParty.profile.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-1">
                            {user?.userType === 'creator' ? 'Client: ' : 'Creator: '}
                            <span className="font-medium">{otherParty.profile.name}</span>
                          </p>
                          
                          <p className="text-sm text-gray-500">
                            Service: {order.service.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${order.pricing.amount}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.userType === 'creator' 
                            ? `You earn: $${order.pricing.creatorEarnings}`
                            : `Total paid: $${order.pricing.amount}`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Ordered: {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-gray-600">
                          Deadline: {format(new Date(order.timeline.deadline), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${getStatusColor(order.status)}-500`}
                          style={{ 
                            width: order.status === 'completed' ? '100%' : 
                                   order.status === 'delivered' ? '80%' :
                                   order.status === 'in_progress' ? '60%' :
                                   order.status === 'payment_confirmed' ? '40%' : '20%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Deliverables */}
                    {order.deliverables.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Deliverables</h4>
                        <div className="space-y-2">
                          {order.deliverables.map((deliverable, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Download className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {deliverable.type === 'file' ? 'File Attachment' : deliverable.content}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(deliverable.uploadedAt), { addSuffix: true })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {order.rating && (
                      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < order.rating!.score
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {order.rating.score}/5
                          </span>
                        </div>
                        {order.rating.review && (
                          <p className="text-sm text-gray-700">{order.rating.review}</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/messages/${order._id}`}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Message</span>
                        </Link>
                        
                        <Link
                          to={`/orders/${order._id}`}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span className="text-sm">View Details</span>
                        </Link>
                      </div>

                      <div className="flex items-center space-x-2">
                        {canPerformAction(order, 'accept') && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order._id, 'payment_confirmed')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Accept Order
                          </button>
                        )}
                        
                        {canPerformAction(order, 'start') && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order._id, 'in_progress')}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Start Work
                          </button>
                        )}
                        
                        {canPerformAction(order, 'deliver') && (
                          <button
                            type="button"
                            onClick={() => navigate(`/orders/${order._id}/deliver`)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                          >
                            Deliver Work
                          </button>
                        )}
                        
                        {canPerformAction(order, 'complete') && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {canPerformAction(order, 'request_revision') && (
                          <button
                            type="button"
                            onClick={() => {
                              const reason = prompt('Please provide revision details:');
                              if (reason) {
                                updateOrderStatus(order._id, 'revision_requested', reason);
                              }
                            }}
                            className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
                          >
                            Request Revision
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setPagination(prev => ({ ...prev, current: page }))}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === pagination.current
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;