import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    Briefcase,
    HelpCircle
} from 'lucide-react';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        { value: 'general', label: 'General Inquiry', icon: MessageSquare },
        { value: 'creator', label: 'Creator Support', icon: Users },
        { value: 'brand', label: 'Brand Partnership', icon: Briefcase },
        { value: 'technical', label: 'Technical Support', icon: HelpCircle },
        { value: 'billing', label: 'Billing & Payments', icon: AlertCircle }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="card p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({
                                    name: '',
                                    email: '',
                                    subject: '',
                                    category: 'general',
                                    message: ''
                                });
                            }}
                            className="btn-primary"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Have questions about Collabstr? We're here to help creators and brands
                            succeed in their collaboration journey.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                                        <Mail className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                                        <p className="text-gray-600">hello@collabstr.com</p>
                                        <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                                        <Phone className="w-6 h-6 text-secondary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM PST</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Visit Us</h3>
                                        <p className="text-gray-600">
                                            123 Innovation Drive<br />
                                            San Francisco, CA 94105
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Business Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
                            <div className="space-y-3">
                                <a href="/help" className="block text-primary-600 hover:text-primary-700 transition-colors">
                                    → Frequently Asked Questions
                                </a>
                                <a href="/help/creators" className="block text-primary-600 hover:text-primary-700 transition-colors">
                                    → Creator Getting Started Guide
                                </a>
                                <a href="/help/brands" className="block text-primary-600 hover:text-primary-700 transition-colors">
                                    → Brand Partnership Guide
                                </a>
                                <a href="/help/billing" className="block text-primary-600 hover:text-primary-700 transition-colors">
                                    → Billing & Payment Help
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        What can we help you with?
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {categories.map((category) => {
                                            const Icon = category.icon;
                                            return (
                                                <label
                                                    key={category.value}
                                                    className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.category === category.value
                                                            ? 'border-primary-300 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={category.value}
                                                        checked={formData.category === category.value}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                    <Icon className={`w-5 h-5 mr-3 ${formData.category === category.value ? 'text-primary-600' : 'text-gray-400'
                                                        }`} />
                                                    <span className={`font-medium ${formData.category === category.value ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>
                                                        {category.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200"
                                        placeholder="Brief description of your inquiry"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all duration-200 resize-none"
                                        placeholder="Please provide details about your inquiry..."
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        {formData.message.length}/500 characters
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Find quick answers to common questions about using Collabstr
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">How do I get started as a creator?</h3>
                                <p className="text-gray-600 text-sm">
                                    Simply sign up, complete your profile with your social media stats,
                                    and start browsing collaboration opportunities that match your niche.
                                </p>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">What fees does Collabstr charge?</h3>
                                <p className="text-gray-600 text-sm">
                                    Collabstr takes a small service fee from successful collaborations.
                                    Creating an account and browsing opportunities is completely free.
                                </p>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">How do payments work?</h3>
                                <p className="text-gray-600 text-sm">
                                    Payments are processed securely through our platform. Creators receive
                                    payment after completing deliverables and brand approval.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">How do I post a campaign as a brand?</h3>
                                <p className="text-gray-600 text-sm">
                                    Create your brand account, set up your company profile, and use our
                                    campaign creation tool to post collaboration opportunities.
                                </p>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Can I work with creators internationally?</h3>
                                <p className="text-gray-600 text-sm">
                                    Yes! Collabstr connects creators and brands globally. You can specify
                                    location preferences when posting campaigns or applying to opportunities.
                                </p>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">What if I need help with a collaboration?</h3>
                                <p className="text-gray-600 text-sm">
                                    Our support team is here to help resolve any issues. Contact us through
                                    this form or email us directly for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;