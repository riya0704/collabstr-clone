import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
    ArrowLeft,
    Plus,
    X
} from 'lucide-react';

interface CampaignForm {
    title: string;
    description: string;
    category: string;
    budget: {
        min: number;
        max: number;
    };
    requirements: {
        followers: {
            min: number;
            platform: string;
        };
        location: string;
        age: {
            min: number;
            max: number;
        };
    };
    deliverables: string[];
    deadline: string;
    campaignType: string;
    targetAudience: string;
}

const CreateCampaign: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [newDeliverable, setNewDeliverable] = useState('');

    const [formData, setFormData] = useState<CampaignForm>({
        title: '',
        description: '',
        category: '',
        budget: { min: 0, max: 0 },
        requirements: {
            followers: { min: 0, platform: 'Instagram' },
            location: '',
            age: { min: 18, max: 65 }
        },
        deliverables: [],
        deadline: '',
        campaignType: 'sponsored-post',
        targetAudience: ''
    });

    const categories = [
        'Fashion & Style', 'Beauty & Makeup', 'Fitness & Health', 'Food & Cooking',
        'Travel & Adventure', 'Technology', 'Gaming', 'Lifestyle', 'Business',
        'Entertainment', 'Education', 'Art & Design'
    ];

    const campaignTypes = [
        { value: 'sponsored-post', label: 'Sponsored Post' },
        { value: 'product-review', label: 'Product Review' },
        { value: 'brand-ambassador', label: 'Brand Ambassador' },
        { value: 'event-coverage', label: 'Event Coverage' },
        { value: 'giveaway', label: 'Giveaway/Contest' },
        { value: 'unboxing', label: 'Unboxing Video' }
    ];

    const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child, grandchild] = name.split('.');

            setFormData(prev => {
                const newFormData = { ...prev };

                if (parent === 'budget') {
                    newFormData.budget = {
                        ...prev.budget,
                        [child]: Number(value)
                    };
                } else if (parent === 'requirements') {
                    if (child === 'followers') {
                        newFormData.requirements = {
                            ...prev.requirements,
                            followers: {
                                ...prev.requirements.followers,
                                [grandchild!]: grandchild === 'min' ? Number(value) : value
                            }
                        };
                    } else if (child === 'age') {
                        newFormData.requirements = {
                            ...prev.requirements,
                            age: {
                                ...prev.requirements.age,
                                [grandchild!]: Number(value)
                            }
                        };
                    } else {
                        newFormData.requirements = {
                            ...prev.requirements,
                            [child]: value
                        };
                    }
                }

                return newFormData;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addDeliverable = () => {
        if (newDeliverable.trim()) {
            setFormData(prev => ({
                ...prev,
                deliverables: [...prev.deliverables, newDeliverable.trim()]
            }));
            setNewDeliverable('');
        }
    };

    const removeDeliverable = (index: number) => {
        setFormData(prev => ({
            ...prev,
            deliverables: prev.deliverables.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
            await axios.post(`${API_URL}/collaborations`, formData);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Error creating campaign:', error);
            alert(error.response?.data?.message || 'Error creating campaign');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-600 hover:text-primary-600 mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
                        <p className="text-gray-600 mt-1">Launch your next influencer marketing campaign</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {step}
                                </div>
                                <span className={`ml-2 font-medium ${currentStep >= step ? 'text-primary-600' : 'text-gray-500'
                                    }`}>
                                    {step === 1 ? 'Basic Info' : step === 2 ? 'Requirements' : 'Review'}
                                </span>
                                {step < 3 && (
                                    <div className={`w-16 h-1 mx-4 ${currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card p-8">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                        placeholder="e.g., Summer Fashion Collection Campaign"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Type *
                                    </label>
                                    <select
                                        name="campaignType"
                                        value={formData.campaignType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                    >
                                        {campaignTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Campaign Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                        placeholder="Describe your campaign goals, brand message, and what you're looking for in creators..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Target Audience
                                    </label>
                                    <input
                                        type="text"
                                        name="targetAudience"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                        placeholder="e.g., Women aged 18-35 interested in sustainable fashion"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Budget Range *
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="number"
                                                    name="budget.min"
                                                    value={formData.budget.min}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                    placeholder="Min ($)"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    name="budget.max"
                                                    value={formData.budget.max}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                    placeholder="Max ($)"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Campaign Deadline
                                        </label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Requirements & Deliverables */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Requirements</h3>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Minimum Followers
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="number"
                                                    name="requirements.followers.min"
                                                    value={formData.requirements.followers.min}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                    placeholder="e.g., 10000"
                                                />
                                                <select
                                                    name="requirements.followers.platform"
                                                    value={formData.requirements.followers.platform}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                >
                                                    {platforms.map(platform => (
                                                        <option key={platform} value={platform}>{platform}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Location Preference
                                            </label>
                                            <input
                                                type="text"
                                                name="requirements.location"
                                                value={formData.requirements.location}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                placeholder="e.g., United States, Global, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Age Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-4 max-w-md">
                                            <input
                                                type="number"
                                                name="requirements.age.min"
                                                value={formData.requirements.age.min}
                                                onChange={handleInputChange}
                                                min="13"
                                                max="100"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                placeholder="Min age"
                                            />
                                            <input
                                                type="number"
                                                name="requirements.age.max"
                                                value={formData.requirements.age.max}
                                                onChange={handleInputChange}
                                                min="13"
                                                max="100"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                placeholder="Max age"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Deliverables</h3>

                                    <div className="flex space-x-2 mb-4">
                                        <input
                                            type="text"
                                            value={newDeliverable}
                                            onChange={(e) => setNewDeliverable(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            placeholder="e.g., 2 Instagram posts, 1 Story, 1 Reel"
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addDeliverable}
                                            className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {formData.deliverables.map((deliverable, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                                                <span className="text-gray-700">{deliverable}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDeliverable(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Campaign</h3>

                                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{formData.title}</h4>
                                        <p className="text-sm text-gray-600">{formData.category} • {formData.campaignType}</p>
                                    </div>

                                    <p className="text-gray-700">{formData.description}</p>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Budget:</span> ${formData.budget.min} - ${formData.budget.max}
                                        </div>
                                        <div>
                                            <span className="font-medium">Deadline:</span> {formData.deadline || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Min Followers:</span> {formData.requirements.followers.min.toLocaleString()} on {formData.requirements.followers.platform}
                                        </div>
                                        <div>
                                            <span className="font-medium">Location:</span> {formData.requirements.location || 'Any'}
                                        </div>
                                    </div>

                                    {formData.deliverables.length > 0 && (
                                        <div>
                                            <span className="font-medium">Deliverables:</span>
                                            <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                                {formData.deliverables.map((deliverable, index) => (
                                                    <li key={index}>{deliverable}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn-primary px-6 py-3"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Campaign...' : 'Launch Campaign'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;