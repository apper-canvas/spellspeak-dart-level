import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Mic',
      title: 'Voice Recognition',
      description: 'Speak words clearly and see them transcribed in real-time',
      color: 'from-primary to-purple-600'
    },
    {
      icon: 'Eye',
      title: 'Visual Feedback',
      description: 'See exactly which letters are correct with color-coded comparisons',
      color: 'from-secondary to-orange-400'
    },
    {
      icon: 'Award',
      title: 'Progress Tracking',
      description: 'Earn stars and track your spelling improvement over time',
      color: 'from-accent to-teal-400'
    },
    {
      icon: 'BookOpen',
      title: 'Grade Levels',
      description: 'Practice with age-appropriate words for grades 1-3',
      color: 'from-success to-green-400'
    }
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-32 h-32 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <ApperIcon name="Mic" className="w-16 h-16 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-display text-primary mb-6">
            Welcome to SpellSpeak!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn spelling the fun way! Speak words out loud and watch as they transform into text. 
            Perfect your spelling with instant visual feedback and celebrate your progress.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
          >
            <Button 
              size="xl" 
              onClick={() => navigate('/practice')}
              className="text-xl px-12 py-4"
            >
              Start Practicing
              <ApperIcon name="ArrowRight" className="w-6 h-6 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => navigate('/progress')}
              className="text-xl px-12 py-4"
            >
              View Progress
              <ApperIcon name="BarChart3" className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-display text-center text-gray-800 mb-12">
            How SpellSpeak Helps You Learn
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-100">
            <h2 className="text-3xl font-display text-center text-gray-800 mb-12">
              Getting Started is Easy!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Choose Your Grade</h3>
                <p className="text-gray-600">Select grade level 1, 2, or 3 to practice age-appropriate words</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Speak the Word</h3>
                <p className="text-gray-600">Press the microphone button and say the word clearly</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Learn & Improve</h3>
                <p className="text-gray-600">See your spelling compared letter by letter and earn stars</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;