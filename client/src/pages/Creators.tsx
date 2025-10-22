import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Users, Instagram, Youtube, Twitter, Filter, Search, Star, Verified } from 'lucide-react';

interface Creator {
  _id: string;
  profile: {
    name: string;
    bio: string;
    avatar: string;
    location: string;
  };
  creatorProfile: {
    categories: string[];
    followers: {
      instagram?: number;
      youtube?: number;
      twitter?: number;
    };
    rates?: {
      post?: number;
      story?: number;
      reel?: number;
    };
  };
  isVerified?: boolean;
}

const Creators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minFollowers: '',
    platform: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCreators();
  }, [filters]);

  const fetchCreators = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.minFollowers) params.append('minFollowers', filters.minFollowers);

      const response = await axios.get(`/api/users/creators?${params}`);
      setCreators(response.data);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  const categories = [
    'Fashion & Style', 'Beauty & Makeup', 'Fitness & Health', 'Food & Cooking', 
    'Travel & Adventure', 'Technology', 'Gaming', 'Lifestyle', 'Business', 
    'Entertainment', 'Education', 'Art & Design'
  ];

  const followerRanges = [
    { label: '1K - 10K', value: '1000' },
    { label: '10K - 100K', value: '10000' },
    { label: '100K - 1M', value: '100000' },
    { label: '1M+', value: '1000000' }
  ];

  const filteredCreators = creators.filter(creator =>
    creator.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.creatorProfile.categories.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with talented content creators across all platforms and niches
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search creators by name or category..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="card p-6 mb-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="Enter location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Followers
                    </label>
                    <select
                      value={filters.minFollowers}
                      onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="">Any Size</option>
                      {followerRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={filters.platform}
                      onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="">All Platforms</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredCreators.length} creators found`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding amazing creators...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <div key={creator._id} className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      {creator.profile.avatar ? (
                        <img
                          src={creator.profile.avatar}
                          alt={creator.profile.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {creator.profile.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    {creator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Verified className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Location */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {creator.profile.name}
                  </h3>
                  {creator.profile.location && (
                    <div className="flex items-center justify-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {creator.profile.location}
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {creator.profile.bio || 'Content creator passionate about sharing amazing experiences'}
                  </p>

                  {/* Categories */}
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {creator.creatorProfile.categories?.slice(0, 2).map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium"
                        >
                          {category}
                        </span>
                      ))}
                      {creator.creatorProfile.categories?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{creator.creatorProfile.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Social Stats */}
                  <div className="flex justify-center space-x-4 mb-4 text-sm">
                    {creator.creatorProfile.followers?.instagram && (
                      <div className="flex items-center text-pink-600">
                        <Instagram className="w-4 h-4 mr-1" />
                        {formatFollowers(creator.creatorProfile.followers.instagram)}
                      </div>
                    )}
                    {creator.creatorProfile.followers?.youtube && (
                      <div className="flex items-center text-red-600">
                        <Youtube className="w-4 h-4 mr-1" />
                        {formatFollowers(creator.creatorProfile.followers.youtube)}
                      </div>
                    )}
                    {creator.creatorProfile.followers?.twitter && (
                      <div className="flex items-center text-blue-600">
                        <Twitter className="w-4 h-4 mr-1" />
                        {formatFollowers(creator.creatorProfile.followers.twitter)}
                      </div>
                    )}
                  </div>

                  {/* Rates */}
                  {creator.creatorProfile.rates?.post && (
                    <div className="text-center mb-4">
                      <span className="text-lg font-bold text-green-600">
                        ${creator.creatorProfile.rates.post}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">per post</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full btn-primary text-sm py-2">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No creators found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters to see more results.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', location: '', minFollowers: '', platform: '' });
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creators;