
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '#about' },
        { text: 'Careers', href: '#careers' },
        { text: 'News', href: '#news' },
        { text: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Products',
      links: [
        { text: 'MedicoScan Pro', href: '#medicoscan' },
        { text: 'VitalTrack™', href: '#vitaltrack' },
        { text: 'NeuralLink Suite', href: '#neurallink' },
        { text: 'All Products', href: '#products' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', href: '#help' },
        { text: 'Documentation', href: '#docs' },
        { text: 'Training', href: '#training' },
        { text: 'Community', href: '#community' },
      ],
    },
  ];
  
  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#facebook' },
    { icon: <Twitter size={20} />, href: '#twitter' },
    { icon: <Linkedin size={20} />, href: '#linkedin' },
    { icon: <Instagram size={20} />, href: '#instagram' },
  ];
  
  return (
    <footer className="bg-medicoart-light border-t border-medicoart-gray/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div>
              <Link to="/" className="text-medicoart-gray-dark font-semibold text-2xl inline-block mb-4">
                <span className="text-medicoart-blue">Medico</span>Art
              </Link>
              <p className="text-medicoart-gray mb-6 max-w-md">
                Redefining healthcare through the perfect fusion of medical precision and artistic innovation.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-medicoart-gray-dark hover:bg-medicoart-blue hover:text-white transition-all duration-300"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-medicoart-gray-dark mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-medicoart-gray hover:text-medicoart-blue transition-all duration-300"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-medicoart-gray/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-medicoart-gray text-sm mb-4 md:mb-0">
            © {currentYear} MedicoArt. All rights reserved.
          </p>
          
          <div className="flex space-x-4 text-sm">
            <a href="#privacy" className="text-medicoart-gray hover:text-medicoart-blue transition-all duration-300">
              Privacy Policy
            </a>
            <a href="#terms" className="text-medicoart-gray hover:text-medicoart-blue transition-all duration-300">
              Terms of Service
            </a>
            <a href="#cookies" className="text-medicoart-gray hover:text-medicoart-blue transition-all duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
