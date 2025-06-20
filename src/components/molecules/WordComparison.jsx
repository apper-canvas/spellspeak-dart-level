import React from 'react';
import { motion } from 'framer-motion';

const WordComparison = ({ targetWord, transcribedWord, showComparison = false }) => {
  if (!showComparison || !targetWord || !transcribedWord) {
    return null;
  }

  const compareWords = (target, transcribed) => {
    const targetLetters = target.toLowerCase().split('');
    const transcribedLetters = transcribed.toLowerCase().split('');
    const maxLength = Math.max(targetLetters.length, transcribedLetters.length);
    
    const comparison = [];
    
    for (let i = 0; i < maxLength; i++) {
      const targetLetter = targetLetters[i] || '';
      const transcribedLetter = transcribedLetters[i] || '';
      
      let status = 'missing';
      if (targetLetter && transcribedLetter) {
        status = targetLetter === transcribedLetter ? 'correct' : 'incorrect';
      } else if (transcribedLetter && !targetLetter) {
        status = 'extra';
      }
      
      comparison.push({
        target: targetLetter,
        transcribed: transcribedLetter,
        status,
        position: i
      });
    }
    
    return comparison;
  };

  const letterComparison = compareWords(targetWord, transcribedWord);
  const isCorrect = targetWord.toLowerCase() === transcribedWord.toLowerCase();

  const getLetterStyle = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-success text-white border-success';
      case 'incorrect':
        return 'bg-error text-white border-error';
      case 'extra':
        return 'bg-warning text-white border-warning';
      case 'missing':
        return 'bg-gray-200 text-gray-500 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Result */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-semibold ${
            isCorrect 
              ? 'bg-success text-white' 
              : 'bg-error text-white'
          }`}
        >
          {isCorrect ? (
            <>
              <span>🎉</span>
              <span>Perfect!</span>
            </>
          ) : (
            <>
              <span>💪</span>
              <span>Try Again!</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Word Comparison */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Letter by Letter
          </h3>
        </div>

        {/* Target Word */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 text-center">Target Word:</p>
          <div className="flex justify-center space-x-2">
            {targetWord.split('').map((letter, index) => (
              <motion.div
                key={`target-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-12 h-12 rounded-lg border-2 border-primary bg-primary text-white flex items-center justify-center text-lg font-bold uppercase"
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transcribed Word */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 text-center">You Said:</p>
          <div className="flex justify-center space-x-2">
            {letterComparison.map((comparison, index) => (
              <motion.div
                key={`transcribed-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold uppercase ${getLetterStyle(comparison.status)}`}
              >
                {comparison.transcribed || '?'}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-success"></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-error"></div>
            <span>Wrong</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-warning"></div>
            <span>Extra</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-gray-200"></div>
            <span>Missing</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WordComparison;