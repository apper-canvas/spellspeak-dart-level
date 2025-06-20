import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import ApperIcon from '../ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="text-center py-16 bg-white shadow-xl">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="mb-8"
            >
              <ApperIcon name="FileQuestion" className="w-32 h-32 text-gray-300 mx-auto" />
            </motion.div>

            <motion.h1 
              className="text-6xl font-display text-primary mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
            >
              Oops!
            </motion.h1>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Page Not Found
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              It looks like this page got lost! Don't worry, let's get you back to practicing your spelling.
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/')}
                icon="Home"
              >
                Go Home
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/practice')}
                icon="Mic"
              >
                Start Practicing
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-purple-50 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                While you're here... 🤔
              </h3>
              <p className="text-gray-600">
                Did you know that practicing spelling for just 10 minutes a day can improve your 
                writing skills dramatically? Why not start a practice session now?
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;