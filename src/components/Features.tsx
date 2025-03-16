
import React, { useRef, useEffect } from 'react';
import { GripHorizontal, HeartPulse, ShieldCheck, Zap } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="feature-card animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 glass p-8 rounded-2xl"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-3 bg-medicoart-blue/10 rounded-xl w-max mb-5 text-medicoart-blue">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-medicoart-gray">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
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
    
    const featuresElement = featuresRef.current;
    if (featuresElement) {
      const elements = featuresElement.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (featuresElement) {
        const elements = featuresElement.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  const features = [
    {
      icon: <HeartPulse size={24} />,
      title: "Advanced Health Monitoring",
      description: "Real-time health data analysis with precision accuracy and intuitive visualization.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Enhanced Security",
      description: "Industry-leading encryption and privacy controls for complete peace of mind.",
    },
    {
      icon: <Zap size={24} />,
      title: "Seamless Integration",
      description: "Effortlessly connects with existing medical systems and health records.",
    },
    {
      icon: <GripHorizontal size={24} />,
      title: "Customizable Interface",
      description: "Tailor the experience to your specific needs with intuitive controls.",
    }
  ];
  
  return (
    <section 
      id="features" 
      ref={featuresRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-medicoart-blue/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-medicoart-blue/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <span className="bg-medicoart-gray-light text-medicoart-blue px-4 py-1 rounded-full text-sm font-medium">
              Key Features
            </span>
          </div>
          
          <h2 className="mt-6 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            Advanced Solutions for Modern Healthcare
          </h2>
          
          <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
            Discover how our innovative approach transforms medical technology through these powerful features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={300 + index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
