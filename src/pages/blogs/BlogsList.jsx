import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import { blogsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import BlogForm from './BlogForm';

import useDebounce from '../../hooks/useDebounce';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 2000);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [debouncedSearch]); // Re-fetch when debounced search changes

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Pass search param if exists
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      
      const response = await blogsAPI.getAllAdmin(params);
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    setActionLoading(true);
    try {
      await blogsAPI.togglePublish(id);
      toast.success('Publish status updated');
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling publish:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await blogsAPI.delete(deleteModal.id);
      toast.success('Blog deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchBlogs();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Create and manage your content strategy</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add Blog
        </Button>
      </div>

      <div className="mb-8 relative group max-w-xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-soft outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all text-sm"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
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
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cover</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Article Details</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                    No articles found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      {blog.featuredImage ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-soft border border-gray-100 bg-white">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                           <FiPlus className="w-6 h-6 rotate-45" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">{blog.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{blog.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                        {blog.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePublish(blog._id)}
                        disabled={actionLoading}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          blog.published 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${blog.published ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        {blog.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 rounded-lg hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: blog._id })}
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
        )}
      </Card>

      {showForm && (
        <BlogForm
          blog={editingBlog}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Blog"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this blog? This action cannot be undone.
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

export default BlogsList;
