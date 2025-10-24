import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
    Settings,
    Save,
    RefreshCw,
    Shield,
    Mail,
    Globe,
    DollarSign,
    Users,
    Bell
} from 'lucide-react';

interface PlatformSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    commissionRate: number;
    minWithdrawal: number;
    maxFileSize: number;
    allowedFileTypes: string[];
    emailNotifications: boolean;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    verificationRequired: boolean;
}

const AdminSettings: React.FC = () => {
    const { token } = useAuth();
    const [settings, setSettings] = useState<PlatformSettings>({
        siteName: 'Collabstr',
        siteDescription: 'Connect creators with brands for amazing collaborations',
        contactEmail: 'contact@collabstr.com',
        supportEmail: 'support@collabstr.com',
        commissionRate: 10,
        minWithdrawal: 50,
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
        emailNotifications: true,
        maintenanceMode: false,
        registrationEnabled: true,
        verificationRequired: false
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings({ ...settings, ...response.data });
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_URL}/admin/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof PlatformSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-600 mt-1">Configure global platform settings and preferences</p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <Globe className="w-6 h-6 text-primary-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Name
                                </label>
                                <input
                                    id="site-name"
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-2">
                                Site Description
                            </label>
                            <textarea
                                id="site-description"
                                rows={3}
                                value={settings.siteDescription}
                                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            />
                        </div>
                    </div>

                    {/* Financial Settings */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">Financial Settings</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="commission-rate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Commission Rate (%)
                                </label>
                                <input
                                    id="commission-rate"
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={settings.commissionRate}
                                    onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="min-withdrawal" className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Withdrawal ($)
                                </label>
                                <input
                                    id="min-withdrawal"
                                    type="number"
                                    min="1"
                                    value={settings.minWithdrawal}
                                    onChange={(e) => handleInputChange('minWithdrawal', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Management Settings */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <Users className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Registration Enabled</h3>
                                    <p className="text-sm text-gray-500">Allow new users to register</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.registrationEnabled}
                                        onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
                                        className="sr-only peer"
                                        aria-label="Enable user registration"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Verification Required</h3>
                                    <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.verificationRequired}
                                        onChange={(e) => handleInputChange('verificationRequired', e.target.checked)}
                                        className="sr-only peer"
                                        aria-label="Require email verification"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* System Settings */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <Shield className="w-6 h-6 text-purple-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                                    <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                                        className="sr-only peer"
                                        aria-label="Enable maintenance mode"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Send system email notifications</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                                        className="sr-only peer"
                                        aria-label="Enable email notifications"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="max-file-size" className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum File Size (MB)
                            </label>
                            <input
                                id="max-file-size"
                                type="number"
                                min="1"
                                max="100"
                                value={settings.maxFileSize}
                                onChange={(e) => handleInputChange('maxFileSize', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary flex items-center px-6 py-3"
                        >
                            {saving ? (
                                <>
                                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;