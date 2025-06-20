import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StarProgress from "@/components/molecules/StarProgress";
import VoiceRecorder from "@/components/molecules/VoiceRecorder";
import WordComparison from "@/components/molecules/WordComparison";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Practice from "@/components/pages/Practice";
import Progress from "@/components/pages/Progress";
import practiceSessionService from "@/services/api/practiceSessionService";
import wordListService from "@/services/api/wordListService";
import sentenceService from "@/services/api/sentenceService";

const PracticeInterface = ({ gradeLevel, onBack, practiceMode = 'word' }) => {
  const [wordLists, setWordLists] = useState([]);
  const [sentenceLists, setSentenceLists] = useState([]);
  const [currentWordList, setCurrentWordList] = useState(null);
  const [currentSentenceList, setCurrentSentenceList] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
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
      if (practiceMode === 'word') {
        const lists = await wordListService.getByGradeLevel(gradeLevel);
        setWordLists(lists);
        if (lists.length > 0) {
          setCurrentWordList(lists[0]);
          setCurrentWord(lists[0].words[0]);
        }
      } else {
        const lists = await sentenceService.getByGradeLevel(gradeLevel);
        setSentenceLists(lists);
        if (lists.length > 0) {
          setCurrentSentenceList(lists[0]);
          setCurrentSentence(lists[0].sentences[0]);
        }
      }
    } catch (error) {
      toast.error(`Failed to load ${practiceMode} lists`);
    } finally {
      setLoading(false);
    }
  };
const handleTranscription = async (transcript) => {
    setTranscribedText(transcript);
    setShowComparison(true);
    let attempt;
    let isCorrect = false;
    
    if (practiceMode === 'word') {
      isCorrect = transcript.toLowerCase() === currentWord.toLowerCase();
      attempt = {
        type: 'word',
        targetWord: currentWord,
        transcribedWord: transcript,
        isCorrect,
        timestamp: new Date().toISOString()
      };
    } else {
      // For sentences, analyze grammar and spelling
      try {
        const analysis = await sentenceService.analyzeSentence(currentSentence, transcript);
        isCorrect = analysis.overallScore >= 80;
        attempt = {
          type: 'sentence',
          targetSentence: currentSentence,
          transcribedSentence: transcript,
          isCorrect,
          grammarAnalysis: analysis,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Analysis error:', error);
        isCorrect = false;
        attempt = {
          type: 'sentence',
          targetSentence: currentSentence,
          transcribedSentence: transcript,
          isCorrect,
          grammarAnalysis: { overallScore: 0, feedback: 'Analysis failed' },
          timestamp: new Date().toISOString()
        };
      }
    }
    
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

  const nextItem = () => {
    if (practiceMode === 'word') {
      if (!currentWordList) return;
      const nextIndex = (currentWordIndex + 1) % currentWordList.words.length;
      setCurrentWordIndex(nextIndex);
      setCurrentWord(currentWordList.words[nextIndex]);
    } else {
      if (!currentSentenceList) return;
      const nextIndex = (currentSentenceIndex + 1) % currentSentenceList.sentences.length;
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(currentSentenceList.sentences[nextIndex]);
    }
    setTranscribedText('');
    setShowComparison(false);
  };

  const changeList = (listId) => {
    if (practiceMode === 'word') {
      const newList = wordLists.find(list => list.Id === listId);
      if (newList) {
        setCurrentWordList(newList);
        setCurrentWordIndex(0);
        setCurrentWord(newList.words[0]);
        setTranscribedText('');
        setShowComparison(false);
      }
    } else {
      const newList = sentenceLists.find(list => list.Id === listId);
      if (newList) {
        setCurrentSentenceList(newList);
        setCurrentSentenceIndex(0);
        setCurrentSentence(newList.sentences[0]);
        setTranscribedText('');
        setShowComparison(false);
      }
    }
  };

  const saveSession = async () => {
    if (sessionAttempts.length === 0) return;
    
    try {
      await practiceSessionService.create({
        practiceMode,
        wordAttempts: practiceMode === 'word' ? sessionAttempts : [],
        sentenceAttempts: practiceMode === 'sentence' ? sessionAttempts : [],
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
        {confetti && <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}>
            {[...Array(20)].map((_, i) => <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                    backgroundColor: ["#6B5FF6", "#FFB84D", "#4ECDC4", "#4EE17B"][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                }}
                animate={{
                    y: [0, -200, 200],
                    x: [0, Math.random() * 200 - 100],
                    rotate: [0, 360],
                    scale: [0, 1, 0]
                }}
                transition={{
                    duration: 1,
                    delay: i * 0.05
                }} />)}
        </motion.div>}
    </AnimatePresence>
{/* Header */}
    <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} icon="ArrowLeft">
            Back to Grade Selection
        </Button>
        <div className="text-center">
            <h2 className="text-2xl font-display text-primary">
                Grade {gradeLevel} {practiceMode === "word" ? "Word" : "Sentence"} Practice
            </h2>
            <StarProgress current={earnedStars} total={totalStars} className="mt-2" />
        </div>
        <Button
            variant="outline"
            onClick={saveSession}
            disabled={sessionAttempts.length === 0}>
            Save Session
        </Button>
    </div>
    {/* List Selector */}
    {(practiceMode === "word" && wordLists.length > 1 || practiceMode === "sentence" && sentenceLists.length > 1) && <Card padding="md" className="bg-white">
        <div className="flex flex-wrap gap-2 justify-center">
            {(practiceMode === "word" ? wordLists : sentenceLists).map(list => <Button
                key={list.Id}
                variant={(practiceMode === "word" ? currentWordList?.Id : currentSentenceList?.Id) === list.Id ? "primary" : "outline"}
                size="sm"
                onClick={() => changeList(list.Id)}>
                {list.category}
            </Button>)}
        </div>
    </Card>}
    {/* Current Item Display */}
    <Card className="text-center bg-gradient-to-br from-primary/5 to-purple-100">
        <motion.div
            key={practiceMode === "word" ? currentWord : currentSentence}
            initial={{
                scale: 0.8,
                opacity: 0
            }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            transition={{
                type: "spring",
                bounce: 0.3
            }}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Say this {practiceMode === "word" ? "word" : "sentence"}:
                          </h3>
            <p
                className={`font-display text-primary mb-4 ${practiceMode === "word" ? "text-4xl md:text-6xl" : "text-xl md:text-2xl"}`}>
                {practiceMode === "word" ? currentWord : currentSentence}
            </p>
            <p className="text-gray-600">
                {practiceMode === "word" ? `Word ${currentWordIndex + 1} of ${currentWordList?.words.length || 0}` : `Sentence ${currentSentenceIndex + 1} of ${currentSentenceList?.sentences.length || 0}`}
            </p>
        </motion.div>
    </Card>
    <Card className="bg-white">
        <VoiceRecorder
            onTranscription={handleTranscription}
            targetWord={practiceMode === "word" ? currentWord : currentSentence}
            isActive={Boolean(practiceMode === "word" ? currentWord : currentSentence)}
            mode={practiceMode} />
    </Card>
    {/* Comparison and Feedback */}
    {showComparison && <Card className="bg-white">
        {practiceMode === "word" ? <WordComparison
            targetWord={currentWord}
            transcribedWord={transcribedText}
            showComparison={showComparison} /> : <div className="space-y-6">
            {/* Sentence Comparison */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Response:</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-lg text-gray-700">{transcribedText}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Target sentence:</p>
                    <p className="text-lg text-primary">{currentSentence}</p>
                </div>
            </div>
            {/* Grammar Feedback */}
            {sessionAttempts[sessionAttempts.length - 1]?.grammarAnalysis && <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">📝 Feedback</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Score:</span>
                        <span className="text-2xl font-bold text-primary">
                            {sessionAttempts[sessionAttempts.length - 1].grammarAnalysis.overallScore}%
                                                  </span>
                    </div>
                    {sessionAttempts[sessionAttempts.length - 1].grammarAnalysis.feedback && <div className="text-sm text-gray-700">
                        <p className="font-medium mb-2">Tips for improvement:</p>
                        <p>{sessionAttempts[sessionAttempts.length - 1].grammarAnalysis.feedback}</p>
                    </div>}
                </div>
            </div>}
        </div>}
        <div className="flex justify-center mt-6">
            <Button onClick={nextItem} variant="primary" size="lg">Next {practiceMode === "word" ? "Word" : "Sentence"}
                <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
        </div>
    </Card>}
    {/* Session Stats */}
    {sessionAttempts.length > 0 && <Card className="bg-gradient-to-r from-accent/10 to-teal-50">
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
    </Card>}
    </div>
  );
};

export default PracticeInterface;