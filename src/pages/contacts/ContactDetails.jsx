import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const ContactDetails = ({ contact, onClose, onStatusUpdate }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</p>
            <p className="mt-1 text-gray-900 font-medium">{contact.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
            <p className="mt-1 text-gray-900">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
            <p className="mt-1 text-gray-900">{contact.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interest</p>
            <p className="mt-1">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                {contact.interest}
              </span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</p>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
            {contact.message}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex gap-2">
              <Button
                variant={contact.status === 'contacted' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onStatusUpdate(contact._id, 'contacted')}
              >
                Mark Contacted
              </Button>
              <Button
                variant={contact.status === 'resolved' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onStatusUpdate(contact._id, 'resolved')}
              >
                Mark Resolved
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactDetails;
