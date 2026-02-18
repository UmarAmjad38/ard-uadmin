import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  required = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 transition-all duration-200 outline-none focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10 placeholder:text-gray-400 text-sm ${
            error ? 'border-red-300 ring-red-500/10' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors p-1.5 rounded-lg hover:bg-white hover:shadow-sm"
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 ml-1 font-medium italic">{error}</p>}
    </div>
  );
};

export default Input;
