
echo "🚀 Moving files to new structure..."

# Move auth components
echo "📁 Moving auth components..."
mv components/auth/* components/features/auth/components/ 2>/dev/null || true
mv components/SignInButton.tsx components/features/auth/components/
rmdir components/auth 2>/dev/null || true

# Move quiz components
echo "📁 Moving quiz components..."
mv components/QuizGenerator.tsx components/features/quiz/components/
mv components/QuizQuestion.tsx components/features/quiz/components/

# Move user components
echo "📁 Moving user components..."
mv components/UserScore.tsx components/features/user/components/

# Move leaderboard components
echo "📁 Moving leaderboard components..."
mv components/Leaderboard.tsx components/features/leaderboard/components/

# Move common/layout components
echo "📁 Moving common components..."
mv components/layout/* components/common/layout/ 2>/dev/null || true
mv components/SessionWrapper.tsx components/common/layout/
mv components/theme-provider.tsx components/common/layout/
rmdir components/layout 2>/dev/null || true

# Move hooks to appropriate features
echo "🎣 Moving hooks..."
mv hooks/useQuiz.ts components/features/quiz/hooks/
mv hooks/useQuizQuestion.ts components/features/quiz/hooks/
mv hooks/useQuizScoring.ts components/features/quiz/hooks/
mv hooks/useUser.ts components/features/user/hooks/

# Move global hooks to lib
mv hooks/use-toast.ts lib/hooks/
mv hooks/use-mobile.tsx lib/hooks/

# Remove empty hooks directory if it's empty
rmdir hooks 2>/dev/null || echo "hooks directory not empty or doesn't exist"

# Move existing lib files to better locations
echo "📚 Organizing lib files..."
mv lib/categories.ts lib/constants/ 2>/dev/null || true

echo "✅ File migration completed!"
