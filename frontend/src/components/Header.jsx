import React from 'react';
import { FaMusic, FaGithub } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-secondary-dark shadow-md py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <FaMusic className="text-primary text-2xl mr-3" />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            <span className="text-primary">Vision</span> to <span className="text-primary">Smell</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-white hover:text-primary transition-colors">Home</a>
          <a href="#converter" className="text-white hover:text-primary transition-colors">Convert</a>
          <a href="#history" className="text-white hover:text-primary transition-colors">Histórico</a>
        </nav>
        
        <a 
          href="https://github.com/Luquitoos/VisionToSmell" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-primary transition-colors"
        >
          <FaGithub className="text-xl mr-2" />
          <span className="hidden md:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
};

export default Header;