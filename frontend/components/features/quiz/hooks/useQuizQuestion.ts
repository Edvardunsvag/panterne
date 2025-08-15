import { useState, useEffect } from "react";

export const useQuizQuestion = (correctAnswer: string, onAnswerSelected: (isCorrect: boolean) => void) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const createConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    
    // Create multiple confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove confetti after animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === correctAnswer;
    
    if (isCorrect) {
      setShowConfetti(true);
      // Delay confetti slightly for better visual effect
      setTimeout(createConfetti, 300);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Delay the callback slightly to allow animation to start
    setTimeout(() => {
      onAnswerSelected(isCorrect);
    }, 100);
  };

  const getOptionClass = (option: string) => {
    const baseClasses = "quiz-option";
    
    if (!isAnswered) {
      return `${baseClasses} bg-white hover:bg-gray-50 border-gray-200`;
    }
    
    if (option === correctAnswer) {
      return `${baseClasses} quiz-correct`;
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return `${baseClasses} quiz-incorrect`;
    }
    
    return `${baseClasses} bg-gray-50 opacity-60 border-gray-200`;
  };

  const getOptionPrefix = (index: number) => {
    const prefixes = ['A', 'B', 'C', 'D'];
    const colors = ['text-red-500', 'text-amber-500', 'text-green-500', 'text-purple-500'];
    return {
      letter: prefixes[index],
      colorClass: colors[index]
    };
  };

  return {
    selectedOption,
    isAnswered,
    showConfetti,
    handleOptionClick,
    getOptionClass,
    getOptionPrefix
  };
}; 