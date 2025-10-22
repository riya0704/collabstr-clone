import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, DollarSign, MapPin, Briefcase, Plus, Clock, Users, Filter, Search, Verified } from 'lucide-react';

interface Collaboration {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  requirements: {
    location?: string;
    followers?: {
      min: number;
      platform: string;
    };
  };
  deliverables: string[];
  deadline: string;
  brand: {
    profile: {
      name: string;
      avatar?: string;
    };
    brandProfile: {
      companyName: string;
    };
    isVerified?: boolean;
  };
  createdAt: string;
}

const Collaborations: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    budget: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCollaborations();
  }, [filters]);

  const fetchCollaborations = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);

      const response = await axios.get(`/api/collaborations?${params}`);
      setCollaborations(response.data);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleApply = async (collaborationId: string) => {
    if (!user) return;
    
    try {
      await axios.post(`/api/collaborations/${collaborationId}/apply`, {
        message: 'I would love to collaborate with your brand!',
        proposedRate: 500
      });
      alert('Application submitted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error applying to collaboration');
    }
  };

  const categories = [
    'Fashion & Style', 'Beauty & Makeup', 'Fitness & Health', 'Food & Cooking',
    'Travel & Adventure', 'Technology', 'Gaming', 'Lifestyle'
  ];

  const filteredCollaborations = collaborations.filter(collab =>
    collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.brand.brandProfile.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Brand Collaborations
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover exciting partnership opportunities with top brands
              </p>
            </div>
            
            {user?.userType === 'brand' && (
              <button className="btn-primary flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Post Campaign
              </button>
            )}
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
                  placeholder="Search campaigns by brand, title, or description..."
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
                <div className="grid md:grid-cols-3 gap-4">
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
                      Budget Range
                    </label>
                    <select
                      value={filters.budget}
                      onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="">Any Budget</option>
                      <option value="0-500">$0 - $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500+">$2,500+</option>
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
            {loading ? 'Loading...' : `${filteredCollaborations.length} campaigns found`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding amazing opportunities...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCollaborations.map((collab) => (
              <div key={collab._id} className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-3">
                            {collab.title}
                          </h3>
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
                            {collab.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <div className="flex items-center mr-4">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {collab.brand.brandProfile.companyName}
                            {collab.brand.isVerified && (
                              <Verified className="w-4 h-4 ml-1 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Posted {formatDate(collab.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {collab.description}
                    </p>

                    {/* Requirements and Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {collab.requirements.followers && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Min {collab.requirements.followers.min.toLocaleString()} followers on {collab.requirements.followers.platform}
                            </div>
                          )}
                          {collab.requirements.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {collab.requirements.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Deliverables</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {collab.deliverables?.slice(0, 3).map((deliverable, index) => (
                            <div key={index}>• {deliverable}</div>
                          ))}
                          {collab.deliverables?.length > 3 && (
                            <div className="text-primary-600">+{collab.deliverables.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget and Actions */}
                  <div className="lg:ml-8 lg:text-right">
                    <div className="mb-4">
                      <div className="flex items-center justify-end text-green-600 font-bold text-xl mb-1">
                        <DollarSign className="w-5 h-5" />
                        {formatBudget(collab.budget.min, collab.budget.max)}
                      </div>
                      {collab.deadline && (
                        <div className="flex items-center justify-end text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {getDaysUntilDeadline(collab.deadline)} days left
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button className="btn-secondary text-sm py-2 px-4">
                        View Details
                      </button>
                      
                      {user?.userType === 'creator' && (
                        <button
                          onClick={() => handleApply(collab._id)}
                          className="btn-primary text-sm py-2 px-4"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCollaborations.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters to see more results.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', budget: '', location: '' });
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

export default Collaborations;