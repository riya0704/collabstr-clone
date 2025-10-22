import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Star, ArrowRight, Users, Briefcase } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const creatorPlans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Create your profile',
        'Browse opportunities',
        'Apply to 5 campaigns/month',
        'Basic analytics',
        'Community access'
      ],
      limitations: [
        'Limited applications',
        'No priority support',
        'Basic profile features'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: isAnnual ? 19 : 29,
      description: 'For serious creators',
      features: [
        'Everything in Free',
        'Unlimited applications',
        'Advanced analytics',
        'Priority support',
        'Verified badge',
        'Portfolio showcase',
        'Direct brand messaging'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Elite',
      price: isAnnual ? 49 : 69,
      description: 'For top-tier creators',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom rate calculator',
        'Advanced brand matching',
        'Exclusive opportunities',
        'White-glove onboarding',
        'Revenue optimization tools'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const brandPlans = [
    {
      name: 'Starter',
      price: isAnnual ? 99 : 149,
      description: 'For small businesses',
      features: [
        'Post unlimited campaigns',
        'Access to creator database',
        'Basic campaign analytics',
        'Email support',
        'Up to 3 team members'
      ],
      limitations: [
        'Limited advanced features',
        'Basic reporting'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Growth',
      price: isAnnual ? 299 : 399,
      description: 'For growing brands',
      features: [
        'Everything in Starter',
        'Advanced creator search',
        'Campaign performance tracking',
        'Priority support',
        'Up to 10 team members',
        'Custom branding',
        'API access'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Growth',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced reporting & analytics',
        'Unlimited team members',
        'SLA guarantee',
        'Custom onboarding'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const [activeTab, setActiveTab] = useState<'creators' | 'brands'>('creators');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg mb-8">
            <button
              onClick={() => setActiveTab('creators')}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === 'creators'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              For Creators
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === 'brands'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              For Brands
            </button>
          </div>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                Save 30%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {(activeTab === 'creators' ? creatorPlans : brandPlans).map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-primary-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                    )}
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-900 mt-6">Limitations:</h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, limitationIndex) => (
                            <li key={limitationIndex} className="flex items-start">
                              <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Creators can start with our free plan forever. Brands get a 14-day free trial of any paid plan with full access to all features.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does billing work?
              </h3>
              <p className="text-gray-600">
                We bill monthly or annually depending on your chosen plan. All payments are processed securely, and you can cancel anytime.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer custom enterprise solutions?
              </h3>
              <p className="text-gray-600">
                Yes! Our Enterprise plan includes custom features, dedicated support, and flexible pricing for large organizations. Contact our sales team for details.
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
            Join thousands of creators and brands already growing their business with Collabstr
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;