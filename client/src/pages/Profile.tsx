import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Globe, Instagram, Youtube, Twitter, Users, Mail } from 'lucide-react';

interface UserProfile {
  _id: string;
  email: string;
  userType: 'creator' | 'brand';
  profile: {
    name: string;
    bio: string;
    avatar?: string;
    location?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      youtube?: string;
      twitter?: string;
    };
  };
  creatorProfile?: {
    categories: string[];
    followers: {
      instagram?: number;
      youtube?: number;
      twitter?: number;
    };
    rates: {
      post?: number;
      story?: number;
      reel?: number;
    };
  };
  brandProfile?: {
    companyName: string;
    industry: string;
    targetAudience: string;
  };
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {profile.profile.avatar ? (
              <img
                src={profile.profile.avatar}
                alt={profile.profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <Users className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.profile.name}
              </h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full capitalize">
                {profile.userType}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
              {profile.profile.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.profile.location}
                </div>
              )}
              {profile.profile.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <a
                    href={profile.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Website
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {profile.email}
              </div>
            </div>
            
            <p className="text-gray-700">
              {profile.profile.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>

      {/* Creator Profile */}
      {profile.userType === 'creator' && profile.creatorProfile && (
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {profile.creatorProfile.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Social Media Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {profile.creatorProfile.followers.instagram && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Instagram className="w-6 h-6 text-pink-600 mr-3" />
                    <span className="font-medium">Instagram</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatFollowers(profile.creatorProfile.followers.instagram)}
                  </span>
                </div>
              )}
              
              {profile.creatorProfile.followers.youtube && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <Youtube className="w-6 h-6 text-red-600 mr-3" />
                    <span className="font-medium">YouTube</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatFollowers(profile.creatorProfile.followers.youtube)}
                  </span>
                </div>
              )}
              
              {profile.creatorProfile.followers.twitter && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Twitter className="w-6 h-6 text-blue-600 mr-3" />
                    <span className="font-medium">Twitter</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatFollowers(profile.creatorProfile.followers.twitter)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rates */}
          {profile.creatorProfile.rates && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rates</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {profile.creatorProfile.rates.post && (
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      ${profile.creatorProfile.rates.post}
                    </div>
                    <div className="text-gray-600">Per Post</div>
                  </div>
                )}
                {profile.creatorProfile.rates.story && (
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      ${profile.creatorProfile.rates.story}
                    </div>
                    <div className="text-gray-600">Per Story</div>
                  </div>
                )}
                {profile.creatorProfile.rates.reel && (
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      ${profile.creatorProfile.rates.reel}
                    </div>
                    <div className="text-gray-600">Per Reel</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brand Profile */}
      {profile.userType === 'brand' && profile.brandProfile && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-gray-900">{profile.brandProfile.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <p className="text-gray-900">{profile.brandProfile.industry}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Audience</label>
              <p className="text-gray-900">{profile.brandProfile.targetAudience}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;