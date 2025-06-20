import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'lg',
  shadow = 'default',
  border = false,
  hover = false,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };

  const baseClasses = `
    bg-surface rounded-2xl
    ${paddings[padding]}
    ${shadows[shadow]}
    ${border ? 'border border-gray-200' : ''}
    ${className}
  `;

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={baseClasses}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

export default Card;