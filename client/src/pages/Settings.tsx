import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
    User,
    Mail,
    Lock,
    Camera,
    Save,
    Bell,
    Shield,
    CreditCard,
    Globe,
    Smartphone,
    Eye,
    EyeOff,
    Check,
    X
} from 'lucide-react';

interface ProfileSettings {
    name: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    collaborationUpdates: boolean;
    messageNotifications: boolean;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Settings: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
        name: user?.profile.name || '',
        email: user?.email || '',
        bio: user?.profile.bio || '',
        location: user?.profile.location || '',
        website: user?.profile.website || '',
        avatar: user?.profile.avatar || ''
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        collaborationUpdates: true,
        messageNotifications: true
    });

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key: keyof NotificationSettings) => {
        setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setLoading(true);
            // Replace with actual upload endpoint
            const response = await axios.post('/api/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfileSettings(prev => ({ ...prev, avatar: response.data.url }));
            setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload avatar' });
        } finally {
            setLoading(false);
        }
    };

    const saveProfileSettings = async () => {
        try {
            setLoading(true);
            await axios.put('/api/users/profile', {
                profile: profileSettings
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const saveNotificationSettings = async () => {
        try {
            setLoading(true);
            await axios.put('/api/users/notifications', notificationSettings);
            setMessage({ type: 'success', text: 'Notification preferences updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update notifications' });
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            setLoading(true);
            await axios.put('/api/users/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await axios.delete('/api/users/account');
                logout();
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to delete account' });
            }
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? (
                            <Check className="w-5 h-5 mr-2" />
                        ) : (
                            <X className="w-5 h-5 mr-2" />
                        )}
                        {message.text}
                    </div>
                )}

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors duration-200 ${activeTab === tab.id
                                            ? 'bg-primary-100 text-primary-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="card p-8">
                            {/* Profile Settings */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
                                        <p className="text-gray-600">Update your profile details and public information</p>
                                    </div>

                                    {/* Avatar Upload */}
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                                {profileSettings.avatar ? (
                                                    <img
                                                        src={profileSettings.avatar}
                                                        alt="Avatar"
                                                        className="w-24 h-24 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-2xl">
                                                        {profileSettings.name?.charAt(0) || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            >
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                                            <p className="text-sm text-gray-600">Upload a new profile photo</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileSettings.name}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileSettings.email}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={profileSettings.location}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                placeholder="City, Country"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={profileSettings.website}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={profileSettings.bio}
                                            onChange={handleProfileChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <button
                                        onClick={saveProfileSettings}
                                        disabled={loading}
                                        className="btn-primary flex items-center disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                                        <p className="text-gray-600">Choose how you want to be notified</p>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(notificationSettings).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {key === 'emailNotifications' && 'Receive notifications via email'}
                                                        {key === 'pushNotifications' && 'Receive push notifications on your device'}
                                                        {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                                                        {key === 'collaborationUpdates' && 'Get notified about collaboration updates'}
                                                        {key === 'messageNotifications' && 'Receive notifications for new messages'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={saveNotificationSettings}
                                        disabled={loading}
                                        className="btn-primary flex items-center disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                                        <p className="text-gray-600">Manage your account security and password</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="currentPassword"
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={changePassword}
                                        disabled={loading}
                                        className="btn-primary flex items-center disabled:opacity-50"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>

                                    {/* Danger Zone */}
                                    <div className="border-t border-gray-200 pt-6 mt-8">
                                        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                            <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                                            <p className="text-red-700 text-sm mb-4">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <button
                                                onClick={deleteAccount}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Billing Settings */}
                            {activeTab === 'billing' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
                                        <p className="text-gray-600">Manage your payment methods and billing information</p>
                                    </div>

                                    <div className="text-center py-12">
                                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Billing Coming Soon</h3>
                                        <p className="text-gray-600">
                                            Payment management features will be available in the next update.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;