import { useState, useEffect } from 'react';
import { FiUser, FiLock, FiSave, FiList, FiTrash2, FiPlus } from 'react-icons/fi';
import { authAPI, interestsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setInitialLoading(false);
    }
  }, [user]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'interests', label: 'Interests', icon: FiList },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, security, and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'profile' && <ProfileTab user={user} updateUser={updateUser} />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'interests' && <InterestsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const ProfileTab = ({ user, updateUser }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateMe({ name: profileData.name });
      updateUser({ name: profileData.name });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 border-t-4 border-t-primary-500 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
          <FiUser className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
      </div>
      
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          required
        />
        <div>
          <Input
            label="Email Address"
            value={profileData.email}
            disabled
            className="opacity-70 bg-gray-50 cursor-not-allowed"
            type="email"
          />
          <p className="text-xs text-gray-500 mt-1">Email address cannot be changed. Please contact support if needed.</p>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            loading={loading}
            className="rounded-xl shadow-soft px-8"
          >
            <FiSave className="mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

const SecurityTab = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 border-t-4 border-t-amber-500 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
          <FiLock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <Input
          label="Current Password"
          type="password"
          placeholder="••••••••"
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          required
        />
        <div className="h-px bg-gray-100 my-2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            variant="secondary"
            loading={loading}
            className="rounded-xl shadow-soft px-8 bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

const InterestsTab = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInterest, setNewInterest] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchInterests = async () => {
    try {
      const response = await interestsAPI.getAll();
      setInterests(response.data.data);
    } catch (error) {
      console.error('Error fetching interests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;

    setAdding(true);
    try {
      await interestsAPI.create({ name: newInterest });
      toast.success('Interest added successfully');
      setNewInterest('');
      fetchInterests(); // Refresh list
    } catch (error) {
      console.error('Error adding interest:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteInterest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interest?')) return;
    try {
      await interestsAPI.delete(id);
      toast.success('Interest deleted successfully');
      setInterests(interests.filter(i => i._id !== id));
    } catch (error) {
      console.error('Error deleting interest:', error);
    }
  };

  return (
    <Card className="p-8 border-t-4 border-t-purple-500 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <FiList className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Manage Interests</h2>
      </div>

      <p className="text-gray-500 mb-6 text-sm">
        Add or remove interests that appear in the contact form dropdown on the website.
      </p>

      {/* Add New Form */}
      <form onSubmit={handleAddInterest} className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="e.g. Villa Buying, Apartment Rental"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="mb-0" // Override default margin
            required
          />
        </div>
        <Button 
          type="submit" 
          loading={adding}
          disabled={!newInterest.trim()}
          className="rounded-xl shadow-soft whitespace-nowrap h-[50px]"
        >
          <FiPlus className="mr-2" /> Add Interest
        </Button>
      </form>

      {/* List */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader size="md" />
          </div>
        ) : interests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No interests found. Add one above!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200/60">
            {interests.map((interest) => (
              <li key={interest._id} className="flex items-center justify-between p-4 hover:bg-white transition-colors">
                <span className="font-medium text-gray-700">{interest.name}</span>
                <button
                  onClick={() => handleDeleteInterest(interest._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Interest"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default ProfileSettings;
