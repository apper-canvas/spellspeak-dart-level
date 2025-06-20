import sentenceData from '../mockData/sentence.json';
import nlp from 'compromise';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sentenceService = {
  async getAll() {
    await delay(300);
    return [...sentenceData];
  },

  async getById(id) {
    await delay(200);
    const item = sentenceData.find(item => item.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  },

  async getByGradeLevel(gradeLevel) {
    await delay(250);
    const filtered = sentenceData.filter(item => item.gradeLevel === gradeLevel);
    return filtered.map(item => ({ ...item }));
  },

  async create(item) {
    await delay(300);
    const newItem = {
      ...item,
      Id: Math.max(...sentenceData.map(item => item.Id), 0) + 1
    };
    sentenceData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(300);
    const index = sentenceData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return null;
    
    const updatedItem = { ...sentenceData[index], ...data };
    sentenceData[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(id) {
    await delay(250);
    const index = sentenceData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return false;
    
    sentenceData.splice(index, 1);
    return true;
  },

  async analyzeSentence(targetSentence, transcribedSentence) {
    await delay(300);
    
    try {
      // Simple analysis for demonstration
      const targetDoc = nlp(targetSentence.toLowerCase());
      const transcribedDoc = nlp(transcribedSentence.toLowerCase());
      
      // Word-by-word comparison
      const targetWords = targetDoc.terms().out('array');
      const transcribedWords = transcribedDoc.terms().out('array');
      
      // Calculate spelling accuracy
      let correctWords = 0;
      const maxLength = Math.max(targetWords.length, transcribedWords.length);
      
      for (let i = 0; i < Math.min(targetWords.length, transcribedWords.length); i++) {
        if (targetWords[i] === transcribedWords[i]) {
          correctWords++;
        }
      }
      
      const spellingScore = maxLength > 0 ? Math.round((correctWords / maxLength) * 100) : 0;
      
      // Grammar analysis (simplified)
      const targetHasProperPunctuation = /[.!?]$/.test(targetSentence.trim());
      const transcribedHasProperPunctuation = /[.!?]$/.test(transcribedSentence.trim());
      const punctuationScore = targetHasProperPunctuation === transcribedHasProperPunctuation ? 100 : 50;
      
      // Length comparison
      const lengthDifference = Math.abs(targetWords.length - transcribedWords.length);
      const lengthScore = lengthDifference === 0 ? 100 : Math.max(0, 100 - (lengthDifference * 20));
      
      // Overall score
      const overallScore = Math.round((spellingScore * 0.6 + punctuationScore * 0.2 + lengthScore * 0.2));
      
      // Generate feedback
      let feedback = '';
      if (spellingScore < 80) {
        feedback += 'Check your spelling of individual words. ';
      }
      if (punctuationScore < 100) {
        feedback += 'Remember to include proper punctuation at the end. ';
      }
      if (lengthDifference > 0) {
        feedback += lengthDifference > 0 ? 'Try to include all the words from the sentence. ' : '';
      }
      if (overallScore >= 90) {
        feedback = 'Excellent work! Your sentence structure and spelling are very good.';
      } else if (overallScore >= 70) {
        feedback = feedback || 'Good effort! Just a few small improvements needed.';
      }
      
      return {
        overallScore,
        spellingScore,
        punctuationScore,
        lengthScore,
        feedback: feedback.trim() || 'Keep practicing to improve your sentences!'
      };
    } catch (error) {
      console.error('Sentence analysis error:', error);
      // Fallback analysis
      const basicScore = targetSentence.toLowerCase() === transcribedSentence.toLowerCase() ? 100 : 60;
      return {
        overallScore: basicScore,
        spellingScore: basicScore,
        punctuationScore: basicScore,
        lengthScore: basicScore,
        feedback: basicScore === 100 ? 'Perfect match!' : 'Good try! Keep practicing your sentences.'
      };
    }
  }
};

export default sentenceService;