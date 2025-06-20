import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import VoiceRecorder from '../molecules/VoiceRecorder';
import WordComparison from '../molecules/WordComparison';
import StarProgress from '../molecules/StarProgress';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import ApperIcon from '../ApperIcon';
import wordListService from '@/services/api/wordListService';
import practiceSessionService from '@/services/api/practiceSessionService';

const PracticeInterface = ({ gradeLevel, onBack }) => {
  const [wordLists, setWordLists] = useState([]);
  const [currentWordList, setCurrentWordList] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [transcribedWord, setTranscribedWord] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    loadWordLists();
  }, [gradeLevel]);

  const loadWordLists = async () => {
    setLoading(true);
    try {
      const lists = await wordListService.getByGradeLevel(gradeLevel);
      setWordLists(lists);
      if (lists.length > 0) {
        setCurrentWordList(lists[0]);
        setCurrentWord(lists[0].words[0]);
      }
    } catch (error) {
      toast.error('Failed to load word lists');
    } finally {
      setLoading(false);
    }
  };

  const handleTranscription = (transcript) => {
    setTranscribedWord(transcript);
    setShowComparison(true);
    
    const isCorrect = transcript.toLowerCase() === currentWord.toLowerCase();
    const attempt = {
      targetWord: currentWord,
      transcribedWord: transcript,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setSessionAttempts(prev => [...prev, attempt]);
    
    if (isCorrect) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1000);
      toast.success('Perfect! Well done! 🎉');
    } else {
      toast.info('Good try! Keep practicing! 💪');
    }
    
    // Update session score
    const newAttempts = [...sessionAttempts, attempt];
    const correctCount = newAttempts.filter(a => a.isCorrect).length;
    const newScore = Math.round((correctCount / newAttempts.length) * 100);
    setSessionScore(newScore);
  };

  const nextWord = () => {
    if (!currentWordList) return;
    
    const nextIndex = (currentWordIndex + 1) % currentWordList.words.length;
    setCurrentWordIndex(nextIndex);
    setCurrentWord(currentWordList.words[nextIndex]);
    setTranscribedWord('');
    setShowComparison(false);
  };

  const changeWordList = (listId) => {
    const newList = wordLists.find(list => list.Id === listId);
    if (newList) {
      setCurrentWordList(newList);
      setCurrentWordIndex(0);
      setCurrentWord(newList.words[0]);
      setTranscribedWord('');
      setShowComparison(false);
    }
  };

  const saveSession = async () => {
    if (sessionAttempts.length === 0) return;
    
    try {
      await practiceSessionService.create({
        wordAttempts: sessionAttempts,
        score: sessionScore,
        duration: Math.floor(Date.now() / 1000) // Simple duration calculation
      });
      toast.success('Session saved!');
    } catch (error) {
      toast.error('Failed to save session');
    }
  };

  const correctCount = sessionAttempts.filter(a => a.isCorrect).length;
  const totalStars = 5;
  const earnedStars = Math.floor((correctCount / Math.max(sessionAttempts.length, 1)) * totalStars);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="Loader2" className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Confetti Effect */}
      <AnimatePresence>
        {confetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ['#6B5FF6', '#FFB84D', '#4ECDC4', '#4EE17B'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -200, 200],
                  x: [0, Math.random() * 200 - 100],
                  rotate: [0, 360],
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 1, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} icon="ArrowLeft">
          Back to Grade Selection
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-display text-primary">Grade {gradeLevel} Practice</h2>
          <StarProgress current={earnedStars} total={totalStars} className="mt-2" />
        </div>
        
        <Button variant="outline" onClick={saveSession} disabled={sessionAttempts.length === 0}>
          Save Session
        </Button>
      </div>

      {/* Word List Selector */}
      {wordLists.length > 1 && (
        <Card padding="md" className="bg-white">
          <div className="flex flex-wrap gap-2 justify-center">
            {wordLists.map((list) => (
              <Button
                key={list.Id}
                variant={currentWordList?.Id === list.Id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => changeWordList(list.Id)}
              >
                {list.category}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Current Word Display */}
      <Card className="text-center bg-gradient-to-br from-primary/5 to-purple-100">
        <motion.div
          key={currentWord}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
        >
          <h3 className="text-sm font-medium text-gray-600 mb-2">Say this word:</h3>
          <p className="text-4xl md:text-6xl font-display text-primary mb-4">
            {currentWord}
          </p>
          <p className="text-gray-600">
            Word {currentWordIndex + 1} of {currentWordList?.words.length || 0}
          </p>
        </motion.div>
      </Card>

      {/* Voice Recorder */}
      <Card className="bg-white">
        <VoiceRecorder
          onTranscription={handleTranscription}
          targetWord={currentWord}
          isActive={Boolean(currentWord)}
        />
      </Card>

      {/* Word Comparison */}
      {showComparison && (
        <Card className="bg-white">
          <WordComparison
            targetWord={currentWord}
            transcribedWord={transcribedWord}
            showComparison={showComparison}
          />
          
          <div className="flex justify-center mt-6">
            <Button onClick={nextWord} variant="primary" size="lg">
              Next Word
              <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Session Stats */}
      {sessionAttempts.length > 0 && (
        <Card className="bg-gradient-to-r from-accent/10 to-teal-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{sessionAttempts.length}</p>
                <p className="text-sm text-gray-600">Words Tried</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{correctCount}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{sessionScore}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{earnedStars}</p>
                <p className="text-sm text-gray-600">Stars</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PracticeInterface;