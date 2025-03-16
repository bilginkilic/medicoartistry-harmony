
import React, { useState, useRef, useEffect } from 'react';
import Button from './ui-custom/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, content, delay }) => {
  return (
    <div 
      className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 flex items-start space-x-4"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-3 bg-medicoart-blue/10 rounded-xl text-medicoart-blue flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-medicoart-gray mb-1">{title}</h4>
        <p className="text-medicoart-gray-dark">{content}</p>
      </div>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const contactRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const contactElement = contactRef.current;
    if (contactElement) {
      const elements = contactElement.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (contactElement) {
        const elements = contactElement.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Here you would typically send this data to a server
    // For now, we'll just reset the form
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };
  
  const contactInfo = [
    {
      icon: <Mail size={20} />,
      title: "Email Us",
      content: "contact@medicoart.com",
    },
    {
      icon: <Phone size={20} />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
    },
    {
      icon: <MapPin size={20} />,
      title: "Visit Us",
      content: "123 Innovation Way, Med City, MC 12345",
    },
  ];
  
  return (
    <section 
      id="contact" 
      ref={contactRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-medicoart-blue/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <span className="bg-medicoart-gray-light text-medicoart-blue px-4 py-1 rounded-full text-sm font-medium">
              Get In Touch
            </span>
          </div>
          
          <h2 className="mt-6 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            We'd Love to Hear From You
          </h2>
          
          <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
            Have questions about our products or services? Our team is ready to assist you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
            <div className="glass p-8 rounded-2xl shadow-subtle">
              <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-medicoart-gray-dark mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-medicoart-gray-light rounded-lg border-transparent focus:border-medicoart-blue focus:ring focus:ring-medicoart-blue/20 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-medicoart-gray-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-medicoart-gray-light rounded-lg border-transparent focus:border-medicoart-blue focus:ring focus:ring-medicoart-blue/20 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-medicoart-gray-dark mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-medicoart-gray-light rounded-lg border-transparent focus:border-medicoart-blue focus:ring focus:ring-medicoart-blue/20 transition-all duration-300"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <ContactInfo
                  key={index}
                  icon={info.icon}
                  title={info.title}
                  content={info.content}
                  delay={400 + index * 100}
                />
              ))}
            </div>
            
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-700">
              <div className="rounded-2xl overflow-hidden shadow-subtle h-64 bg-medicoart-gray-light">
                {/* Placeholder for a map - In a real application, you might use Google Maps or similar */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
