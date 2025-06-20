import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GradeLevelSelector from '../molecules/GradeLevelSelector';
import PracticeInterface from '../organisms/PracticeInterface';
import Card from '../atoms/Card';

const Practice = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  const handleBack = () => {
    setSelectedGrade(null);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!selectedGrade ? (
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <motion.h1 
                  className="text-4xl md:text-5xl font-display text-primary mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
                >
                  Let's Practice Spelling!
                </motion.h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose your grade level to start practicing with words that are just right for you.
                </p>
              </div>

              {/* Grade Level Selector */}
              <Card padding="xl" className="bg-white shadow-xl">
                <GradeLevelSelector
                  selectedGrade={selectedGrade}
                  onGradeSelect={handleGradeSelect}
                />
              </Card>

              {/* Tips Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <Card className="bg-gradient-to-r from-accent/10 to-teal-50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    🎯 Practice Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Speak Clearly</h4>
                        <p className="text-gray-600 text-sm">Say each word slowly and clearly for best results</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Find a Quiet Space</h4>
                        <p className="text-gray-600 text-sm">Practice in a quiet room for better voice recognition</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Learn from Mistakes</h4>
                        <p className="text-gray-600 text-sm">Red letters show what to practice more</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Practice Regularly</h4>
                        <p className="text-gray-600 text-sm">A few minutes each day helps you improve faster</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          ) : (
            <PracticeInterface 
              gradeLevel={selectedGrade} 
              onBack={handleBack}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Practice;