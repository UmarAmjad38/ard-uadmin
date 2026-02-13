import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { categoriesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import CategoryForm from './CategoryForm';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await categoriesAPI.delete(deleteModal.id);
      toast.success('Category deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your content with blog categories</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add Category
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider font-sans">Description</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400 font-medium">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight text-xs">{category.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-500 max-w-md line-clamp-1">{category.description || 'No description provided'}</p>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-400">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-lg hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: category._id })}
                          className="p-2 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors"
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
      </Card>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Category"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal({ show: false, id: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={actionLoading}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesList;
