
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './ui-custom/Button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { text: 'Home', href: '#home' },
    { text: 'Features', href: '#features' },
    { text: 'Products', href: '#products' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-subtle py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-medicoart-gray-dark font-semibold text-2xl transition-all hover:opacity-80"
        >
          <span className="text-medicoart-blue">Medico</span>Art
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-medicoart-gray-dark font-medium text-sm transition-all duration-300 hover:text-medicoart-blue"
            >
              {link.text}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-medicoart-gray-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out pt-20',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="container mx-auto px-6 flex flex-col space-y-6 py-6">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-medicoart-gray-dark font-medium text-xl transition-all duration-300 hover:text-medicoart-blue"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.text}
            </a>
          ))}
          <Button className="mt-4 w-full">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
