import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown } from 'react-icons/fi';

const Select = ({ 
  label, 
  error, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option',
  className = '',
  required = false,
  name // Added name here
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  console.log('Select Render:', { label, name, value, options }); // Debug log


  // Find the label of the current selected value
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event) => {
      // If the scroll event originated from within the dropdown menu, don't close it
      if (menuRef.current && menuRef.current.contains(event.target)) {
        return;
      }
      if (isOpen) setIsOpen(false);
    };

    const handleResize = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    console.log('Select handleSelect:', optionValue, 'name:', name); // Debug log
    onChange({ target: { name, value: optionValue } }); // Added name here
    setIsOpen(false);
  };

  return (
    <div className={`relative mb-4 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div 
        onClick={toggleOpen}
        className={`
          w-full px-4 py-3 rounded-2xl border bg-white shadow-soft cursor-pointer transition-all duration-200 flex items-center justify-between
          ${isOpen ? 'border-primary-400 ring-4 ring-primary-500/5' : 'border-gray-100 hover:border-gray-200'}
          ${error ? 'border-red-500 ring-red-500/5' : ''}
        `}
      >
        <span className={`text-sm ${!selectedOption ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={menuRef}
          className="fixed z-[9999] bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
          style={{
            top: coords.top,
            left: coords.left,
            width: coords.width,
          }}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${option.value === value 
                    ? 'bg-primary-50 text-primary-700 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                {option.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400 italic">No options available</div>
            )}
          </div>
        </div>,
        document.body
      )}
      
      {error && <p className="mt-2 text-xs font-bold text-red-500 px-1">{error}</p>}
    </div>
  );
};

export default Select;
