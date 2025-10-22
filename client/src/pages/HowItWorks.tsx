import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  MessageSquare, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Users,
  Briefcase,
  Star,
  Shield
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How Collabstr Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect, collaborate, and grow your business with our simple 4-step process
          </p>
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              For Creators
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Earning from Your Content
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your passion into profit with brand collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Sign Up</h3>
              <p className="text-gray-600">
                Create your free account and build your creator profile with your social media stats and content portfolio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Browse Campaigns</h3>
              <p className="text-gray-600">
                Discover brand collaboration opportunities that match your niche, audience, and content style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Apply & Create</h3>
              <p className="text-gray-600">
                Submit your application with a custom pitch, create amazing content, and deliver on time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">4. Get Paid</h3>
              <p className="text-gray-600">
                Receive secure payments directly to your account and build long-term brand relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Brands Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              For Brands
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Launch Successful Campaigns
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reach your target audience through authentic creator partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Create Campaign</h3>
              <p className="text-gray-600">
                Set up your campaign with clear objectives, budget, and requirements for the perfect creator match.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Find Creators</h3>
              <p className="text-gray-600">
                Browse our database of verified creators or let them apply to your campaigns directly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Collaborate</h3>
              <p className="text-gray-600">
                Work directly with creators, provide feedback, and ensure your brand message is perfectly delivered.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">4. Measure Results</h3>
              <p className="text-gray-600">
                Track campaign performance, measure ROI, and build lasting relationships with top creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Collabstr?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most trusted platform for creator-brand collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Trusted</h3>
              <p className="text-gray-600">
                All creators and brands are verified. Secure payment processing and dispute resolution ensure safe transactions.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Star className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Our vetting process ensures you work with authentic creators who deliver high-quality content and real engagement.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Access creators from around the world across all major social media platforms and content categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and brands already collaborating on Collabstr
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center"
            >
              Start as Creator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-primary-600 transition-all duration-200 inline-flex items-center justify-center"
            >
              Start as Brand
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;