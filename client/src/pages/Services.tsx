import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Star, 
  Clock, 
  User,
  Grid,
  List
} from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    basic: {
      price: number;
      deliveryTime: number;
    };
  };
  gallery: string[];
  creator: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
    isVerified: boolean;
  };
  stats: {
    rating: number;
    reviews: number;
    orders: number;
  };
  seo: {
    slug: string;
  };
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    deliveryTime: '',
    rating: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const categories = [
    'Social Media Marketing',
    'Content Creation',
    'Video Production',
    'Photography',
    'Graphic Design',
    'Copywriting',
    'Influencer Marketing',
    'Brand Strategy'
  ];

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    fetchServices();
  }, [filters, sortBy, pagination.current]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '12',
        sortBy,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.deliveryTime && { deliveryTime: filters.deliveryTime }),
        ...(filters.rating && { rating: filters.rating })
      });

      const response = await axios.get(`${API_URL}/services?${params}`);
      setServices(response.data.services);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      deliveryTime: '',
      rating: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find the Perfect Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse thousands of services from verified creators and agencies
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search for services..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div className="mb-6">
                <label htmlFor="delivery-time-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <select
                  id="delivery-time-filter"
                  value={filters.deliveryTime}
                  onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                >
                  <option value="">Any Time</option>
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">1 Week</option>
                  <option value="14">2 Weeks</option>
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  id="rating-filter"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="w-full btn-secondary text-sm py-2"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {pagination.total} services found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <label htmlFor="sort-select" className="sr-only">Sort services by</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                >
                  <option value="createdAt">Newest</option>
                  <option value="stats.rating">Highest Rated</option>
                  <option value="pricing.basic.price">Price: Low to High</option>
                  <option value="-pricing.basic.price">Price: High to Low</option>
                  <option value="stats.orders">Most Popular</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    title="Grid view"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="List view"
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Services Grid/List */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {services.map((service) => (
                  <Link
                    key={service._id}
                    to={`/services/${service.seo.slug}`}
                    className={`card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Service Image */}
                    <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'} bg-gray-200 rounded-t-2xl overflow-hidden`}>
                      {service.gallery[0] ? (
                        <img
                          src={service.gallery[0]}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1">
                      {/* Creator Info */}
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3">
                          {service.creator.profile.avatar ? (
                            <img
                              src={service.creator.profile.avatar}
                              alt={service.creator.profile.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-xs">
                              {service.creator.profile.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {service.creator.profile.name}
                            {service.creator.isVerified && (
                              <span className="ml-1 text-blue-500">✓</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {service.title}
                      </h3>

                      {/* Rating and Reviews */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900 ml-1">
                            {service.stats.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({service.stats.reviews})
                          </span>
                        </div>
                      </div>

                      {/* Price and Delivery */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.pricing.basic.deliveryTime} day delivery
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Starting at</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${service.pricing.basic.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

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
      </div>
    </div>
  );
};

export default Services;