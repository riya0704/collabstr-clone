
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Creators from './pages/Creators';
import Collaborations from './pages/Collaborations';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CollaborationManagement from './pages/admin/CollaborationManagement';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Analytics from './pages/Analytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="collaborations" element={<CollaborationManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/creators" element={<Creators />} />
                    <Route path="/collaborations" element={<Collaborations />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-campaign" element={<CreateCampaign />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;