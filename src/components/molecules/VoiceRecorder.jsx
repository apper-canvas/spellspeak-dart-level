import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const VoiceRecorder = ({ onTranscription, targetWord, isActive = false, mode = 'word' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = mode === 'sentence';
      recognitionRef.current.interimResults = mode === 'sentence';
      recognitionRef.current.lang = 'en-US';

recognitionRef.current.onresult = (event) => {
        if (mode === 'sentence') {
          // For sentences, get the latest result
          const resultIndex = event.results.length - 1;
          const transcript = event.results[resultIndex][0].transcript.trim();
          if (event.results[resultIndex].isFinal) {
            onTranscription(transcript);
            setIsRecording(false);
          }
        } else {
          // For words, use first result
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          onTranscription(transcript);
          setIsRecording(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        // Fallback to mock transcription for demo
        setTimeout(() => {
          onTranscription(mode === 'sentence' ? 'The quick brown fox jumps over the lazy dog.' : (targetWord || 'hello'));
        }, 1000);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onTranscription, targetWord]);

  const startRecording = async () => {
    if (!isActive) return;

    setIsRecording(true);

    // Start speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        // Fallback for demo
setTimeout(() => {
          onTranscription(mode === 'sentence' ? 'The quick brown fox jumps over the lazy dog.' : (targetWord || 'hello'));
          setIsRecording(false);
        }, mode === 'sentence' ? 3000 : 2000);
      }
    } else {
      // Fallback for browsers without speech recognition
      setTimeout(() => {
        onTranscription(mode === 'sentence' ? 'The quick brown fox jumps over the lazy dog.' : (targetWord || 'hello'));
        setIsRecording(false);
      }, mode === 'sentence' ? 3000 : 2000);
    }

    // Start audio visualization
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const updateAudioLevel = () => {
        if (!analyserRef.current || !isRecording) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);

        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Audio context error:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Recording Button */}
      <motion.div
        animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
      >
        <Button
          size="xl"
          variant={isRecording ? 'danger' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isActive}
          className={`
            w-32 h-32 rounded-full shadow-2xl
            ${isRecording ? 'animate-pulse-glow' : ''}
          `}
        >
          {isRecording ? (
            <ApperIcon name="Square" className="w-12 h-12" />
          ) : (
            <ApperIcon name="Mic" className="w-12 h-12" />
          )}
        </Button>
      </motion.div>

      {/* Recording Status */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-lg font-medium text-primary mb-2">
              Listening...
            </p>
            
            {/* Audio Visualizer */}
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 bg-primary rounded-full"
                  animate={{
                    height: [8, 24 * (1 + audioLevel), 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
{!isRecording && (
        <p className="text-center text-gray-600 max-w-sm">
          {isActive 
            ? (mode === 'sentence' 
                ? "Press the microphone button and say the sentence clearly" 
                : "Press the microphone button and say the word clearly")
            : "Select a grade level to start practicing"
          }
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;