
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isRounded?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isRounded = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantStyles = {
    primary: 'bg-medicoart-blue hover:bg-medicoart-blue-dark text-white focus:ring-medicoart-blue/50',
    secondary: 'bg-medicoart-gray-light hover:bg-medicoart-gray/20 text-medicoart-gray-dark focus:ring-medicoart-gray/50',
    outline: 'bg-transparent border border-medicoart-gray/30 hover:bg-medicoart-gray-light text-medicoart-gray-dark focus:ring-medicoart-gray/50',
    ghost: 'bg-transparent hover:bg-medicoart-gray-light text-medicoart-gray-dark focus:ring-medicoart-gray/50',
  };
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  const roundedStyles = isRounded ? 'rounded-full' : 'rounded-md';
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
