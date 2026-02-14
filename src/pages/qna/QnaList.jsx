import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiHelpCircle } from 'react-icons/fi';
import { qnaAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import QnaForm from './QnaForm';

const QnaList = () => {
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingQna, setEditingQna] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQnas();
  }, []);

  const fetchQnas = async () => {
    setLoading(true);
    try {
      const response = await qnaAPI.getAll();
      setQnas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching QnAs:', error);
      toast.error('Failed to fetch QnAs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await qnaAPI.delete(deleteModal.id);
      toast.success('QnA deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchQnas();
    } catch (error) {
      console.error('Error deleting QnA:', error);
      toast.error('Failed to delete QnA');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (qna) => {
    setEditingQna(qna);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingQna(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchQnas();
  };

  const filteredQnas = qnas.filter(qna => 
    qna.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qna.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QnA Management</h1>
          <p className="text-gray-500 mt-1">Manage questions and answers for your platform</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add QnA
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search by question or answer..."
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
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Question</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Answer</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredQnas.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-gray-400 font-medium">
                      No QnAs found
                    </td>
                  </tr>
                ) : (
                  filteredQnas.map((qna) => (
                    <tr key={qna._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6 align-top max-w-xs">
                        <p className="font-semibold text-gray-900">{qna.question}</p>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-sm text-gray-500 line-clamp-3">{qna.answer}</p>
                      </td>
                      <td className="py-4 px-6 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(qna)}
                            className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: qna._id })}
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

      {/* QnA Form Modal */}
      {showForm && (
        <QnaForm
          qna={editingQna}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete QnA"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this QnA? This action cannot be undone.
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

export default QnaList;
