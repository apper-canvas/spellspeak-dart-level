import React from 'react';
import { motion } from 'framer-motion';
import ProgressDashboard from '../organisms/ProgressDashboard';

const Progress = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-display text-primary mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
            >
              Your Spelling Progress
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how much you've improved! Track your spelling accuracy and celebrate your achievements.
            </p>
          </div>

          {/* Progress Dashboard */}
          <ProgressDashboard />
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;