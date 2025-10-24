import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Star, 
  Clock, 
  RefreshCw, 
  Check, 
  MessageCircle, 
  Heart,
  Share2,
  ArrowLeft,
  User,
  Verified
} from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  pricing: {
    basic: {
      price: number;
      description: string;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    standard: {
      price: number;
      description: string;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    premium: {
      price: number;
      description: string;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
  };
  gallery: string[];
  requirements: string;
  creator: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
      bio?: string;
      location?: string;
    };
    isVerified: boolean;
    creatorProfile: {
      categories: string[];
    };
  };
  stats: {
    rating: number;
    reviews: number;
    orders: number;
  };
}

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('basic');


  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/services/${slug}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.userType !== 'brand') {
      alert('Only brands can place orders');
      return;
    }

    // TODO: Implement order modal
    console.log('Order now clicked for package:', selectedPackage);
  };

  const handleContactCreator = async () => {
    if (!user || !service) return;

    try {
      const response = await axios.post(`${API_URL}/messages/conversations`, {
        recipientId: service.creator._id,
        serviceId: service._id
      });

      navigate(`/messages/${response.data._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service not found</h1>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <button type="button" onClick={() => navigate('/services')} className="btn-primary">
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const currentPackage = service.pricing[selectedPackage];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Gallery */}
            <div className="card p-0 overflow-hidden">
              <div className="aspect-video bg-gray-200">
                {service.gallery[0] ? (
                  <img
                    src={service.gallery[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="card p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h1>
                  
                  {/* Creator Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-4">
                      {service.creator.profile.avatar ? (
                        <img
                          src={service.creator.profile.avatar}
                          alt={service.creator.profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {service.creator.profile.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.creator.profile.name}
                        </h3>
                        {service.creator.isVerified && (
                          <Verified className="w-5 h-5 text-blue-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {service.stats.rating.toFixed(1)} ({service.stats.reviews} reviews)
                        <span className="mx-2">•</span>
                        {service.stats.orders} orders completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    title="Add to favorites"
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    title="Share service"
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Requirements */}
              {service.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {service.requirements}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card p-6">
                {/* Package Selector */}
                <div className="flex border-b border-gray-200 mb-6">
                  {Object.entries(service.pricing).map(([key]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPackage(key as any)}
                      className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                        selectedPackage === key
                          ? 'border-b-2 border-primary-600 text-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {/* Package Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${currentPackage.price}
                    </h3>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentPackage.deliveryTime} day delivery
                      </div>
                      <div className="flex items-center mt-1">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        {currentPackage.revisions} revisions
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {currentPackage.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {currentPackage.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    Order Now (${currentPackage.price})
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleContactCreator}
                    className="w-full btn-secondary py-3 flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Creator
                  </button>
                </div>

                {/* Service Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{service.stats.orders}</p>
                      <p className="text-sm text-gray-600">Orders Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{service.stats.rating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;