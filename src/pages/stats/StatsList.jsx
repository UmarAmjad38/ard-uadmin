import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiBarChart2 } from 'react-icons/fi';
import { statsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import StatForm from './StatForm';

const StatsList = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await statsAPI.getAll();
      setStats(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await statsAPI.delete(deleteModal.id);
      toast.success('Stat deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast.error('Failed to delete stat');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (stat) => {
    setEditingStat(stat);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStat(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchStats();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stats Management</h1>
          <p className="text-gray-500 mt-1">Update key metrics like experience, clients, and properties sold</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add Stat
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Value</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Label</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-gray-400 font-medium">
                      No stats found. Add your first metric!
                    </td>
                  </tr>
                ) : (
                  stats.map((stat) => (
                    <tr key={stat._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                          {stat.value}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900">{stat.label}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(stat)}
                            className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: stat._id })}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stat Form Modal */}
      {showForm && (
        <StatForm
          stat={editingStat}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Stat"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this metric?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={actionLoading}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StatsList;
