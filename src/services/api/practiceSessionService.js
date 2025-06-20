import practiceSessionData from '../mockData/practiceSession.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const practiceSessionService = {
  async getAll() {
    await delay(300);
    return [...practiceSessionData];
  },

  async getById(id) {
    await delay(200);
    const item = practiceSessionData.find(item => item.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  },

  async getRecent(limit = 10) {
    await delay(250);
    const sorted = [...practiceSessionData]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    return sorted;
  },

async create(item) {
    await delay(300);
    const newItem = {
      ...item,
      Id: Math.max(...practiceSessionData.map(item => item.Id), 0) + 1,
      timestamp: new Date().toISOString(),
      practiceMode: item.practiceMode || 'word',
      wordAttempts: item.wordAttempts || [],
      sentenceAttempts: item.sentenceAttempts || []
    };
    practiceSessionData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(300);
    const index = practiceSessionData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return null;
    
    const updatedItem = { ...practiceSessionData[index], ...data };
    practiceSessionData[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(id) {
    await delay(250);
    const index = practiceSessionData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return false;
    
    practiceSessionData.splice(index, 1);
    return true;
  }
};

export default practiceSessionService;