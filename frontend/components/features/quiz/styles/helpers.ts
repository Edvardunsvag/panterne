export const getOptionClass = (optionIndex: number, isAnswered: boolean, currentQuestion: any, selectedAnswer: number | null) => {
    const baseClasses = "w-full text-left justify-start h-auto p-4 whitespace-normal transition-all duration-300 quiz-option"
    
    if (!isAnswered) {
      return `${baseClasses} hover:scale-[1.02] hover:shadow-lg`
    }
    
    if (optionIndex === currentQuestion?.correctIndex) {
      return `${baseClasses} quiz-correct`
    }
    
    if (optionIndex === selectedAnswer && optionIndex !== currentQuestion?.correctIndex) {
      return `${baseClasses} quiz-incorrect`
    }
    
    return `${baseClasses} opacity-60`
  }

  export const getOptionBorderColor = (index: number) => {
    const colors = ['border-l-red-400', 'border-l-amber-400', 'border-l-green-400', 'border-l-purple-400']
    return colors[index] || 'border-l-gray-400'
  }


  export const createConfettiFromButton = (buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement) return

    const buttonRect = buttonElement.getBoundingClientRect()
    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top + buttonRect.height / 2

    const confettiContainer = document.createElement('div')
    confettiContainer.style.position = 'fixed'
    confettiContainer.style.top = '0'
    confettiContainer.style.left = '0'
    confettiContainer.style.width = '100%'
    confettiContainer.style.height = '100%'
    confettiContainer.style.pointerEvents = 'none'
    confettiContainer.style.zIndex = '1000'
    
    // Create confetti pieces that burst out from the button
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece confetti-burst'
      
      // Start from button center
      const startX = buttonCenterX
      const startY = buttonCenterY
      
      // Create burst pattern - random angles in full circle
      const angle = (Math.random() * 360) * (Math.PI / 180)
      const distance = Math.random() * 200 + 100 // 100-300px burst radius
      const velocity = Math.random() * 300 + 200 // Initial velocity
      
      // Calculate burst end position (where confetti reaches peak of arc)
      const burstEndX = startX + Math.cos(angle) * distance
      const burstEndY = startY + Math.sin(angle) * distance
      
      // Final fall position (gravity takes over)
      const fallEndX = burstEndX + (Math.random() - 0.5) * 100
      const fallEndY = window.innerHeight + 50
      
      // Set CSS custom properties for the animation
      confetti.style.setProperty('--start-x', startX + 'px')
      confetti.style.setProperty('--start-y', startY + 'px')
      confetti.style.setProperty('--burst-x', burstEndX + 'px')
      confetti.style.setProperty('--burst-y', burstEndY + 'px')
      confetti.style.setProperty('--fall-x', fallEndX + 'px')
      confetti.style.setProperty('--fall-y', fallEndY + 'px')
      
      // Random timing for more natural effect
      confetti.style.animationDelay = Math.random() * 0.3 + 's'
      confetti.style.animationDuration = (Math.random() * 1 + 2.5) + 's'
      
      // Random rotation speed
      const rotationSpeed = (Math.random() - 0.5) * 1440 // -720 to +720 degrees
      confetti.style.setProperty('--rotation', rotationSpeed + 'deg')
      
      confettiContainer.appendChild(confetti)
    }
    
    document.body.appendChild(confettiContainer)
    
    // Clean up after animation
    setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer)
      }
    }, 4000)
  }

  export const createConfetti = () => {
    // Fallback confetti for quiz completion
    const confettiContainer = document.createElement('div')
    confettiContainer.style.position = 'fixed'
    confettiContainer.style.top = '0'
    confettiContainer.style.left = '0'
    confettiContainer.style.width = '100%'
    confettiContainer.style.height = '100%'
    confettiContainer.style.pointerEvents = 'none'
    confettiContainer.style.zIndex = '1000'
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.animationDelay = Math.random() * 2 + 's'
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
      confettiContainer.appendChild(confetti)
    }
    
    document.body.appendChild(confettiContainer)
    
    setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer)
      }
    }, 4000)
  }
