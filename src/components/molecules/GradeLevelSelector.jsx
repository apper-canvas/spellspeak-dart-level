import React from 'react';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';

const GradeLevelSelector = ({ selectedGrade, onGradeSelect, className = '' }) => {
  const grades = [
    { level: 1, label: 'Grade 1', description: 'Simple words', color: 'from-pink-400 to-pink-500' },
    { level: 2, label: 'Grade 2', description: 'Medium words', color: 'from-blue-400 to-blue-500' },
    { level: 3, label: 'Grade 3', description: 'Harder words', color: 'from-green-400 to-green-500' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        Choose Your Grade Level
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {grades.map((grade) => (
          <motion.button
            key={grade.level}
            onClick={() => onGradeSelect(grade.level)}
            className={`
              p-6 rounded-2xl border-3 transition-all duration-200
              ${selectedGrade === grade.level
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${grade.color} mx-auto mb-3 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{grade.level}</span>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-1">{grade.label}</h4>
              <p className="text-sm text-gray-600">{grade.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GradeLevelSelector;