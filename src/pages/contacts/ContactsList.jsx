import { useState, useEffect } from 'react';
import { FiEye, FiTrash2, FiFilter } from 'react-icons/fi';
import { contactsAPI, interestsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import ContactDetails from './ContactDetails';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pages: 1, page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    interest: '',
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchInterests();
  }, [filters.page, filters.status, filters.interest]);

  const fetchInterests = async () => {
    try {
      const response = await interestsAPI.getAll();
      setInterests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getAll(filters);
      setContacts(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await contactsAPI.delete(deleteModal.id);
      toast.success('Contact deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await contactsAPI.updateStatus(id, status);
      toast.success('Status updated');
      fetchContacts();
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading && filters.page === 1) {
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Leads</h1>
          <p className="text-gray-500 mt-1">Nurture and manage your customer inquiries</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 max-w-sm">
          <Select
            label="Filter by Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'new', label: 'New Inquiry' },
              { value: 'contacted', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
        </div>
        <div className="flex-1 max-w-sm">
          <Select
            label="Filter by Interest"
            value={filters.interest}
            onChange={(e) => setFilters({ ...filters, interest: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Interests' },
              ...interests.map(i => ({ value: i.name, label: i.name })),
              { value: 'Other', label: 'Other' } // Keep Other just in case
            ]}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date Received</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Lead Information</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Interest Area</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                    No leads matching your filters
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{new Date(contact.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-primary-100/50">
                        {contact.interest}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-32">
                        <Select
                          value={contact.status}
                          onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                          options={[
                            { value: 'new', label: 'New' },
                            { value: 'contacted', label: 'Contacted' },
                            { value: 'resolved', label: 'Resolved' },
                          ]}
                          className="mb-0 text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 rounded-lg hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: contact._id })}
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

        {/* Pagination - Safe access */}
        {pagination?.pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 bg-gray-50/30">
            <p className="text-xs font-medium text-gray-500">
              Page <span className="text-gray-900">{filters.page}</span> of <span className="text-gray-900">{pagination.pages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="rounded-xl px-4 py-2 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={filters.page >= (pagination?.pages || 0)}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="rounded-xl px-4 py-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedContact && (
        <ContactDetails
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Lead"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this lead?
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

export default ContactsList;
