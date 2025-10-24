import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  totalCollaborations: number;
  activeCollaborations: number;
  completedCollaborations: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  userGrowthRate: string;
}

interface AdminContextType {
  isAdmin: boolean;
  stats: AdminStats | null;
  loading: boolean;
  fetchStats: () => Promise<void>;
  checkAdminStatus: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    checkAdminStatus();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAdminStatus = () => {
    const adminStatus = user?.isAdmin || false;
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  const fetchStats = async () => {
    if (!isAdmin || !token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAdmin,
    stats,
    loading,
    fetchStats,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};