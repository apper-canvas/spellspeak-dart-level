import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const StarProgress = ({ current, total, score = 0, className = '' }) => {
  const stars = Array.from({ length: total }, (_, index) => {
    const isEarned = index < current;
    const isPartial = index === current && score > 0 && score < 100;
    
    return {
      id: index,
      earned: isEarned,
      partial: isPartial,
      progress: isPartial ? score / 100 : isEarned ? 1 : 0
    };
  });

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {stars.map((star, index) => (
        <motion.div
          key={star.id}
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring', bounce: 0.5 }}
        >
          {/* Background star */}
          <ApperIcon 
            name="Star" 
            className="w-8 h-8 text-gray-300" 
          />
          
          {/* Filled star */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ 
              clipPath: star.earned 
                ? 'inset(0 0 0 0)' 
                : star.partial 
                  ? `inset(${100 - (star.progress * 100)}% 0 0 0)`
                  : 'inset(100% 0 0 0)'
            }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <ApperIcon 
              name="Star" 
              className="w-8 h-8 text-secondary fill-current" 
            />
          </motion.div>
          
          {/* Sparkle effect for completed stars */}
          {star.earned && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
            >
              <ApperIcon name="Sparkles" className="w-8 h-8 text-secondary" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StarProgress;