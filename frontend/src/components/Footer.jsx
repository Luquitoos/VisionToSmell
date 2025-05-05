import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-dark py-4 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-2 md:mb-0">
          &copy; {year} Video to Audio Converter. Todos os direitos reservados (Eu acho kkkk).
        </div>
        
        <div className="flex space-x-4">
          <a 
            href="#converter" 
            className="text-gray-400 hover:text-primary transition-colors text-sm"
          >
            Converter
          </a>
          <a 
            href="#history" 
            className="text-gray-400 hover:text-primary transition-colors text-sm"
          >
            Histórico
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
