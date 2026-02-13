import { useState, useEffect } from 'react';
import { FiGrid, FiFileText, FiFolder, FiMail, FiPlus } from 'react-icons/fi'; // Changed FiUsers to FiFolder
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    blogs: 0,
    categories: 0,
    contacts: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        
        setStats({
          properties: data.data.counts.properties,
          blogs: data.data.counts.blogs,
          categories: data.data.counts.categories,
          contacts: data.data.counts.contacts
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Toast handled by interceptor
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.properties,
      icon: FiGrid,
      color: 'bg-primary-50 text-primary-600',
      border: 'border-primary-100',
      link: '/properties'
    },
    {
      title: 'Total Blogs',
      value: stats.blogs,
      icon: FiFileText,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      link: '/blogs'
    },
    {
      title: 'Total Categories', // Changed from Team Members
      value: stats.categories,
      icon: FiFolder, // Changed Icon
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      link: '/categories'
    },
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: FiMail,
      color: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      link: '/contacts'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link to={card.link} key={index} className="block group">
              <Card className={`p-6 border-b-4 hover:-translate-y-1 transition-all duration-300 ${card.border.replace('border-', 'border-b-')} h-full`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                    <h3 className="text-3xl font-black text-gray-800">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
