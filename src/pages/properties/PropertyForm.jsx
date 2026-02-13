import { useState, useEffect } from 'react';
import { propertiesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const PropertyForm = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceFrom: '',
    priceTo: '',
    currency: 'AED',
    area: '',
    city: 'Dubai',
    address: '',
    propertyTypes: [],
    areaSize: '',
    areaUnit: 'sqft',
    developer: '',
    status: 'available',
    amenities: '',
    features: '',
  });
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const [additionalPhotoFiles, setAdditionalPhotoFiles] = useState([]);
  const [additionalPhotoPreviews, setAdditionalPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        description: property.description || '',
        priceFrom: property.price?.from || '',
        priceTo: property.price?.to || '',
        currency: property.price?.currency || 'AED',
        area: property.location?.area || '',
        city: property.location?.city || 'Dubai',
        address: property.location?.address || '',
        propertyTypes: property.propertyTypes || [],
        areaSize: property.area?.size || '',
        areaUnit: property.area?.unit || 'sqft',
        developer: property.developer || '',
        status: property.status || 'available',
        amenities: property.amenities?.join(', ') || '',
        features: property.features?.join(', ') || '',
      });
      if (property.coverPhoto) {
        setCoverPhotoPreview(property.coverPhoto);
      }
      if (property.additionalPhotos && property.additionalPhotos.length > 0) {
        // Assuming strings are URLs
        setAdditionalPhotoPreviews(property.additionalPhotos);
      }
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalPhotoFiles(prev => [...prev, ...files]);
      
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setAdditionalPhotoPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalPhoto = (index) => {
    setAdditionalPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price[from]', formData.priceFrom);
      if (formData.priceTo) data.append('price[to]', formData.priceTo);
      data.append('price[currency]', formData.currency);
      data.append('location[area]', formData.area);
      data.append('location[city]', formData.city);
      if (formData.address) data.append('location[address]', formData.address);
      
      if (formData.propertyTypes.length > 0) {
        formData.propertyTypes.forEach(type => {
          data.append('propertyTypes[]', type);
        });
      }
      
      if (formData.areaSize) {
        data.append('area[size]', formData.areaSize);
        data.append('area[unit]', formData.areaUnit);
      }
      if (formData.developer) data.append('developer', formData.developer);
      data.append('status', formData.status);
      
      if (formData.amenities) {
        const amenitiesArray = formData.amenities.split(',').map(a => a.trim());
        amenitiesArray.forEach(amenity => {
          data.append('amenities[]', amenity);
        });
      }
      
      if (formData.features) {
        const featuresArray = formData.features.split(',').map(f => f.trim());
        featuresArray.forEach(feature => {
          data.append('features[]', feature);
        });
      }

      if (coverPhotoFile) {
        data.append('coverPhoto', coverPhotoFile);
      }
      
      if (additionalPhotoFiles.length > 0) {
        additionalPhotoFiles.forEach(file => {
          data.append('additionalPhotos', file);
        });
      }

      if (property) {
        await propertiesAPI.update(property._id, data);
        toast.success('Property updated successfully');
      } else {
        await propertiesAPI.create(data);
        toast.success('Property created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const propertyTypeOptions = [
    { value: 'Studio', label: 'Studio' },
    { value: '1 Bedroom', label: '1 Bedroom' },
    { value: '2 Bedroom', label: '2 Bedroom' },
    { value: '3 Bedroom', label: '3 Bedroom' },
    { value: '4 Bedroom', label: '4 Bedroom' },
    { value: '5 Bedroom', label: '5 Bedroom' },
    { value: '6 Bedroom', label: '6 Bedroom' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Duplex Villa', label: 'Duplex Villa' },
    { value: 'Offices', label: 'Offices' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'under-construction', label: 'Under Construction' },
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title={property ? 'Edit Property' : 'Add Property'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Property Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Luxury 3 Bedroom Apartment"
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Provide a detailed description of the property features and highlights..."
            />
          </div>

          <Input
            label="Price (AED)"
            type="number"
            name="priceFrom"
            value={formData.priceFrom}
            onChange={handleChange}
            required
            placeholder="e.g. 1500000"
          />

          <Select
            label="Property Type"
            name="propertyTypes"
            value={formData.propertyTypes[0] || ''}
            onChange={(e) => setFormData({ ...formData, propertyTypes: [e.target.value] })}
            options={propertyTypeOptions}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Area / Location"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              placeholder="e.g. Downtown Dubai"
            />
          </div>

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Dubai"
          />

          <Input
            label="Address (Optional)"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Blvd Plaza, Sheikh Mohammed bin Rashid Blvd"
          />

          <div className="md:col-span-2">
            <Input
              label="Area Size (sqft)"
              type="number"
              name="areaSize"
              value={formData.areaSize}
              onChange={handleChange}
              placeholder="e.g. 2100"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Developer"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              placeholder="e.g. Emaar"
            />
          </div>

          <div className="md:col-span-2">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Amenities (comma-separated)"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g., Pool, Gym, Parking"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Features (comma-separated)"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g., Balcony, Sea View, Smart Home"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {coverPhotoPreview && (
              <img
                src={coverPhotoPreview}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Photos (Multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalPhotosChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {additionalPhotoPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalPhotoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalPhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L11.414 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {property ? 'Update' : 'Create'} Property
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PropertyForm;
