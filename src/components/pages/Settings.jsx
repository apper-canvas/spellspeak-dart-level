import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    childName: '',
    defaultGrade: 1,
    soundEnabled: true,
    autoAdvance: false,
    practiceTime: 10,
    encouragementLevel: 'normal'
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('spellspeak-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('spellspeak-settings', JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Settings saved successfully! 🎉');
  };

  const resetSettings = () => {
    const defaultSettings = {
      childName: '',
      defaultGrade: 1,
      soundEnabled: true,
      autoAdvance: false,
      practiceTime: 10,
      encouragementLevel: 'normal'
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  const testVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      toast.success('Voice recognition is working! 🎤');
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-white to-yellow-50">
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
              Settings
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Customize SpellSpeak to make learning even more fun and effective for you!
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Personal Settings */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <ApperIcon name="User" className="w-6 h-6 text-primary mr-3" />
                Personal Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={settings.childName}
                  onChange={(e) => handleSettingChange('childName', e.target.value)}
                  icon="User"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Grade Level
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((grade) => (
                      <Button
                        key={grade}
                        variant={settings.defaultGrade === grade ? 'primary' : 'outline'}
                        onClick={() => handleSettingChange('defaultGrade', grade)}
                        className="flex-1"
                      >
                        Grade {grade}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning Preferences */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-secondary mr-3" />
                Learning Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Sound Effects</h3>
                    <p className="text-sm text-gray-600">Play sounds for correct and incorrect answers</p>
                  </div>
                  <Button
                    variant={settings.soundEnabled ? 'success' : 'outline'}
                    onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                    icon={settings.soundEnabled ? 'Volume2' : 'VolumeX'}
                  >
                    {settings.soundEnabled ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Auto Advance</h3>
                    <p className="text-sm text-gray-600">Automatically move to next word after 3 seconds</p>
                  </div>
                  <Button
                    variant={settings.autoAdvance ? 'success' : 'outline'}
                    onClick={() => handleSettingChange('autoAdvance', !settings.autoAdvance)}
                    icon={settings.autoAdvance ? 'Play' : 'Pause'}
                  >
                    {settings.autoAdvance ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Practice Session Length (minutes)
                  </label>
                  <div className="flex space-x-2">
                    {[5, 10, 15, 20].map((time) => (
                      <Button
                        key={time}
                        variant={settings.practiceTime === time ? 'accent' : 'outline'}
                        onClick={() => handleSettingChange('practiceTime', time)}
                        className="flex-1"
                      >
                        {time}m
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Encouragement Level
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'gentle', label: 'Gentle', icon: 'Heart' },
                      { value: 'normal', label: 'Normal', icon: 'Smile' },
                      { value: 'enthusiastic', label: 'Enthusiastic', icon: 'Zap' }
                    ].map((level) => (
                      <Button
                        key={level.value}
                        variant={settings.encouragementLevel === level.value ? 'success' : 'outline'}
                        onClick={() => handleSettingChange('encouragementLevel', level.value)}
                        icon={level.icon}
                        className="flex-1"
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* System Settings */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <ApperIcon name="Settings" className="w-6 h-6 text-accent mr-3" />
                System Settings
              </h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={testVoiceRecognition}
                  icon="Mic"
                  className="w-full"
                >
                  Test Voice Recognition
                </Button>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Browser Compatibility</h4>
                  <p>
                    SpellSpeak works best with Chrome, Safari, and Edge browsers. 
                    Make sure to allow microphone access when prompted.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={saveSettings}
                disabled={!hasChanges}
                icon="Save"
              >
                Save Settings
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={resetSettings}
                icon="RotateCcw"
              >
                Reset to Defaults
              </Button>
            </div>

            {/* Fun Stats */}
            {settings.childName && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-primary/10 to-purple-100 text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Great job, {settings.childName}! 🌟
                  </h3>
                  <p className="text-gray-600">
                    Keep practicing and you'll become a spelling champion!
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;