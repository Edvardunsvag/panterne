import { useState } from "react";

export const useQuizQuestion = (correctAnswer: string, onAnswerSelected: (isCorrect: boolean) => void) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === correctAnswer;
    onAnswerSelected(isCorrect);
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) return "bg-white hover:bg-gray-50";
    if (option === correctAnswer) return "quiz-correct";
    if (option === selectedOption) return "quiz-incorrect";
    return "bg-white opacity-50";
  };

  return {
    selectedOption,
    isAnswered,
    handleOptionClick,
    getOptionClass
  };
}; 