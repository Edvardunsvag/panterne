export interface StoredQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  source: string;
  category: string;
  generatedAt: string;
}

export const loadStoredQuestions = async (): Promise<StoredQuestion[]> => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'app/data/stored-questions.json');
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading stored questions:', error);
    return [];
  }
};

export const saveNewQuestions = async (questions: StoredQuestion[]): Promise<void> => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'app/data/stored-questions.json');
    
    const existingQuestions = await loadStoredQuestions();
    const allQuestions = [...existingQuestions, ...questions];
    
    fs.writeFileSync(filePath, JSON.stringify(allQuestions, null, 2));
  } catch (error) {
    console.error('Error saving questions:', error);
  }
}; 