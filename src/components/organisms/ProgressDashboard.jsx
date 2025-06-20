import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '../atoms/Card';
import ApperIcon from '../ApperIcon';
import practiceSessionService from '@/services/api/practiceSessionService';

const ProgressDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await practiceSessionService.getRecent(10);
      setSessions(result);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (sessions.length === 0) return { totalWords: 0, accuracy: 0, averageScore: 0, bestScore: 0 };

    const totalWords = sessions.reduce((sum, session) => sum + session.wordAttempts.length, 0);
    const correctWords = sessions.reduce((sum, session) => 
      sum + session.wordAttempts.filter(attempt => attempt.isCorrect).length, 0
    );
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    const averageScore = sessions.length > 0 ? Math.round(sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length) : 0;
    const bestScore = sessions.length > 0 ? Math.max(...sessions.map(session => session.score)) : 0;

    return { totalWords, accuracy, averageScore, bestScore };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadSessions}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="BarChart3" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">No Practice Sessions Yet</h3>
          <p className="text-gray-500 mb-6">Start practicing to see your progress here!</p>
          <button
            onClick={() => window.location.href = '/practice'}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Start Practicing
          </button>
        </motion.div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="text-center bg-gradient-to-br from-primary/10 to-purple-100">
            <ApperIcon name="Target" className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{stats.totalWords}</p>
            <p className="text-sm text-gray-600">Words Practiced</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center bg-gradient-to-br from-success/10 to-green-100">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{stats.accuracy}%</p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center bg-gradient-to-br from-secondary/10 to-orange-100">
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary">{stats.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center bg-gradient-to-br from-accent/10 to-teal-100">
            <ApperIcon name="Award" className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">{stats.bestScore}%</p>
            <p className="text-sm text-gray-600">Best Score</p>
          </Card>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Practice Sessions</h3>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  session.score >= 80 ? 'bg-success text-white' :
                  session.score >= 60 ? 'bg-secondary text-white' :
                  'bg-gray-400 text-white'
                }`}>
                  <span className="font-bold">{session.score}%</span>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800">
                    {session.wordAttempts.length} words practiced
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.timestamp), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {session.wordAttempts.filter(a => a.isCorrect).length} correct
                </p>
                <div className="flex space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      className={`w-4 h-4 ${
                        i < Math.floor((session.score / 100) * 5)
                          ? 'text-secondary fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressDashboard;