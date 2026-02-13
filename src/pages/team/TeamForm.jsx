import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const TeamForm = ({ member, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        email: member.email || '',
        phone: member.phone || '',
        bio: member.bio || '',
        active: member.active ?? true,
      });
      if (member.image) {
        setImagePreview(member.image);
      }
    }
  }, [member]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      data.append('active', formData.active);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (member) {
        await teamAPI.update(member._id, data);
        toast.success('Member updated successfully');
      } else {
        await teamAPI.create(data);
        toast.success('Member created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={member ? 'Edit Member' : 'Add Member'} size="md">
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          placeholder="e.g. Sales Director"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Textarea
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
        />

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Active member</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Member Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-32 w-32 object-cover rounded-full mx-auto"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {member ? 'Update' : 'Create'} Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamForm;
