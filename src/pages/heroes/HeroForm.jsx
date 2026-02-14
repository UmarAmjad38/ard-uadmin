import { useState, useEffect } from 'react';
import { heroSectionsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const HeroForm = ({ hero, pages, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    page: '',
    heading: '',
    subheading: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData({
        page: hero.page?._id || hero.page || '',
        heading: hero.heading || '',
        subheading: hero.subheading || '',
        description: hero.description || '',
      });
      if (hero.backgroundImage) {
        setImagePreview(hero.backgroundImage);
      }
    } else if (pages.length > 0) {
       // Default to first page if creating new
       setFormData(prev => ({ ...prev, page: pages[0]._id }));
    }
  }, [hero, pages]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    
    if (!imageFile && !hero?.backgroundImage) {
        toast.error('Please select a background image');
        return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('page', formData.page);
      data.append('heading', formData.heading);
      data.append('subheading', formData.subheading);
      data.append('description', formData.description);

      if (imageFile) {
        data.append('backgroundImage', imageFile);
      }

      if (hero) {
        await heroSectionsAPI.update(hero._id, data);
        toast.success('Hero section updated');
      } else {
        await heroSectionsAPI.create(data);
        toast.success('Hero section created');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving hero section:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={hero ? 'Edit Hero Content' : 'Add Hero Content'} size="lg">
      <form onSubmit={handleSubmit}>
        <Select
          label="Target Page"
          name="page"
          value={formData.page}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Page' },
            ...pages.map(p => ({ value: p._id, label: p.name }))
          ]}
        />

        <Input
          label="Heading"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
          required
          placeholder="Main highlight of the hero section"
        />

        <Input
          label="Subheading"
          name="subheading"
          value={formData.subheading}
          onChange={handleChange}
          placeholder="Sub-headline or catchphrase"
        />

        <Textarea
          label="Description / Paragraph"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Detailed paragraph text"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
              />
              <p className="text-xs text-gray-400 mt-2">Recommended size: 1920x1080px</p>
            </div>
            {imagePreview && (
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-soft shrink-0 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {hero ? 'Update Changes' : 'Save Hero Content'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HeroForm;
