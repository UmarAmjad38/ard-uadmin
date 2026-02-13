import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { teamAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import TeamForm from './TeamForm';

const TeamList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAllAdmin();
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await teamAPI.delete(deleteModal.id);
      toast.success('Team member deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchMembers();
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-gray-500 mt-1">Manage and organize your professional team</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl shadow-soft px-6">
          <FiPlus className="w-5 h-5 mr-1" />
          Add Member
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Member</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Position</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400 font-medium">
                    No team members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {member.image ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-soft border border-gray-100">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold border border-primary-100 text-lg">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-600">{member.position}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        member.active 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${member.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 rounded-lg hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: member._id })}
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
        <TeamForm
          member={editingMember}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Member"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this team member?
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

export default TeamList;
