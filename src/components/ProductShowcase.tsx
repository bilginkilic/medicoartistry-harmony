
import React, { useRef, useEffect } from 'react';
import Button from './ui-custom/Button';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  delay: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, delay }) => {
  return (
    <div 
      className="product-card animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 glass shadow-subtle flex flex-col rounded-2xl overflow-hidden h-full"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="aspect-video overflow-hidden bg-medicoart-gray-light">
        <div className="w-full h-full transition-all duration-500 ease-out hover:scale-105">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-medicoart-gray mb-6 flex-grow">{description}</p>
        <Button variant="outline" className="mt-auto w-full">
          Learn More
        </Button>
      </div>
    </div>
  );
};

const ProductShowcase: React.FC = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  
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
    
    const productsElement = productsRef.current;
    if (productsElement) {
      const elements = productsElement.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (productsElement) {
        const elements = productsElement.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  const products = [
    {
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      title: "MedicoScan Pro",
      description: "Advanced diagnostic imaging with AI-powered analysis for accurate results.",
    },
    {
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      title: "VitalTrack™",
      description: "Continuous health monitoring system with real-time alerts and insights.",
    },
    {
      image: "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
      title: "NeuralLink Suite",
      description: "Comprehensive neural monitoring and analysis for advanced care.",
    },
  ];
  
  return (
    <section 
      id="products" 
      ref={productsRef}
      className="py-24 bg-medicoart-light relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-medicoart-blue/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <span className="bg-medicoart-gray-light text-medicoart-blue px-4 py-1 rounded-full text-sm font-medium">
              Our Products
            </span>
          </div>
          
          <h2 className="mt-6 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            Precision Medical Technology
          </h2>
          
          <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
            Explore our innovative medical solutions designed with precision, elegance, and exceptional user experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              title={product.title}
              description={product.description}
              delay={300 + index * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-600">
          <Button size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
