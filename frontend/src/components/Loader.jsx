import React from 'react';
import PropTypes from 'prop-types';

/* Componente Loader para exibir os spinners de carregamento */
const Loader = ({ size = 'md', color = 'primary', className = '', label = 'Carregando...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const colors = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-400',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-label={label}>
      <svg 
        className={`animate-spin ${sizes[size]} ${colors[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string,
  label: PropTypes.string
};

export default Loader;
