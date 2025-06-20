import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-purple-600 hover:to-primary shadow-lg',
    secondary: 'bg-gradient-to-r from-secondary to-orange-400 text-white hover:from-orange-400 hover:to-secondary shadow-lg',
    accent: 'bg-gradient-to-r from-accent to-teal-400 text-white hover:from-teal-400 hover:to-accent shadow-lg',
    success: 'bg-gradient-to-r from-success to-green-400 text-white hover:from-green-400 hover:to-success shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-gradient-to-r from-error to-red-400 text-white hover:from-red-400 hover:to-error shadow-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-full
    transition-all duration-200 transform
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-primary/20
    ${variants[variant]} ${sizes[size]} ${className}
  `;

  const content = (
    <>
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;