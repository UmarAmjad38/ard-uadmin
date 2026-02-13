import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiSearch, FiGrid } from 'react-icons/fi';
import { propertiesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import PropertyForm from './PropertyForm';

import useDebounce from '../../hooks/useDebounce';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pages: 1, page: 1, limit: 10, total: 0 });
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 2000);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    // search removed from here, managed separately via debounce
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters.page, debouncedSearch]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = { ...filters, search: debouncedSearch };
      const response = await propertiesAPI.getAll(queryParams);
      setProperties(response.data.data || []);
      setPagination(response.data.pagination || { pages: 1, page: 1, limit: 10, total: 0 });
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };



  const handleToggleFeatured = async (id) => {
    setActionLoading(true);
    try {
      await propertiesAPI.toggleFeatured(id);
      toast.success('Featured status updated');
      fetchProperties();
    } catch (error) {
      console.error('Error toggling featured:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await propertiesAPI.delete(deleteModal.id);
      toast.success('Property deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchProperties();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Properties</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your property listings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add Property
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, slug or location..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-soft outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
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
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Image</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Property Details</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">Featured</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                    No properties found
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      {property.coverPhoto ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-soft border border-gray-100 bg-white">
                          <img
                            src={property.coverPhoto}
                            alt={property.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                          <FiGrid className="w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{property.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{property.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        property.status === 'available' ? 'bg-green-50 text-green-700 border-green-100' :
                        property.status === 'sold' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${
                          property.status === 'available' ? 'bg-green-500' :
                          property.status === 'sold' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></span>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(property._id)}
                        disabled={actionLoading}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          property.featured 
                            ? 'text-yellow-500 bg-yellow-50 shadow-sm border border-yellow-100' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <FiStar className="w-4 h-4" fill={property.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: property._id })}
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

        {/* Pagination - Safe access */}
        {pagination?.pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 bg-gray-50/30">
            <p className="text-xs font-medium text-gray-500">
              Showing <span className="text-gray-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="text-gray-900">{pagination.total}</span> results
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="rounded-xl px-4 py-2 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= (pagination?.pages || 0)}
                className="rounded-xl px-4 py-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Property"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this property? This action cannot be undone.
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

export default PropertiesList;
