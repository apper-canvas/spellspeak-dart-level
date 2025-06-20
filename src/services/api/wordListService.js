import wordListData from '../mockData/wordList.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const wordListService = {
  async getAll() {
    await delay(300);
    return [...wordListData];
  },

  async getById(id) {
    await delay(200);
    const item = wordListData.find(item => item.Id === parseInt(id, 10));
    return item ? { ...item } : null;
  },

  async getByGradeLevel(gradeLevel) {
    await delay(250);
    const filtered = wordListData.filter(item => item.gradeLevel === gradeLevel);
    return filtered.map(item => ({ ...item }));
  },

  async create(item) {
    await delay(300);
    const newItem = {
      ...item,
      Id: Math.max(...wordListData.map(item => item.Id), 0) + 1
    };
    wordListData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(300);
    const index = wordListData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return null;
    
    const updatedItem = { ...wordListData[index], ...data };
    wordListData[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(id) {
    await delay(250);
    const index = wordListData.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) return false;
    
    wordListData.splice(index, 1);
    return true;
  }
};

export default wordListService;