import { useState, useEffect } from 'react';
import { statsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const StatForm = ({ stat, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    label: '',
    value: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stat) {
      setFormData({
        label: stat.label || '',
        value: stat.value || '',
      });
    }
  }, [stat]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (stat) {
        await statsAPI.update(stat._id, formData);
        toast.success('Stat updated successfully');
      } else {
        await statsAPI.create(formData);
        toast.success('Stat created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving stat:', error);
      toast.error(error.response?.data?.message || 'Failed to save stat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={stat ? 'Edit Stat' : 'Add Stat'} size="md">
      <form onSubmit={handleSubmit}>
        <Input
          label="Value (e.g., 3+, 500+, 1000+)"
          name="value"
          value={formData.value}
          onChange={handleChange}
          required
          placeholder="Enter metric value"
        />

        <Input
          label="Label (e.g., Years Experience, Happy Clients)"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          placeholder="Enter metric label"
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {stat ? 'Update Stat' : 'Save Stat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StatForm;
