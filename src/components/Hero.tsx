
import React, { useEffect, useRef } from 'react';
import Button from './ui-custom/Button';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
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
    
    const heroElement = heroRef.current;
    if (heroElement) {
      const elements = heroElement.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (heroElement) {
        const elements = heroElement.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen pt-32 pb-20 flex items-center bg-medicoart-light overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-radial from-medicoart-blue/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-radial from-medicoart-blue/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-block animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
              <span className="bg-medicoart-gray-light text-medicoart-blue px-4 py-1 rounded-full text-sm font-medium">
                Revolutionary Healthcare Technology
              </span>
            </div>
            
            <h1 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
              Redefining Medical <br /> 
              <span className="text-medicoart-blue">Excellence</span> Through Art
            </h1>
            
            <p className="text-xl animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
              Discover the perfect fusion of medical precision and artistic innovation with our state-of-the-art healthcare solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-400">
              <Button size="lg">
                Explore Products
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            
            <div className="pt-6 flex items-center gap-6 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-500">
              <div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-medicoart-gray-light border-2 border-white flex items-center justify-center text-xs text-medicoart-gray-dark font-medium">
                      {i}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-medicoart-gray">
                <span className="font-medium text-medicoart-gray-dark">500+</span> medical professionals trust us
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-600">
              <div className="relative z-10 animate-float glass p-4 rounded-2xl shadow-elevation overflow-hidden">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-medicoart-blue/80 to-medicoart-blue-dark">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-medicoart-blue/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-20 h-20 bg-medicoart-blue/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
