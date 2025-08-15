#!/bin/bash

echo "🔧 Fixing import paths after file migration..."

# Fix app/page.tsx imports
echo "📝 Fixing app/page.tsx..."
sed -i '' 's|from "@/components/QuizGenerator"|from "@/components/features/quiz/components/QuizGenerator"|g' app/page.tsx
sed -i '' 's|from "@/components/UserScore"|from "@/components/features/user/components/UserScore"|g' app/page.tsx
sed -i '' 's|from "@/components/Leaderboard"|from "@/components/features/leaderboard/components/Leaderboard"|g' app/page.tsx
sed -i '' 's|from "@/components/SignInButton"|from "@/components/features/auth/components/SignInButton"|g' app/page.tsx

# Fix app/layout.tsx imports
echo "📝 Fixing app/layout.tsx..."
sed -i '' 's|from "@/components/layout/Navbar"|from "@/components/common/layout/Navbar"|g' app/layout.tsx
sed -i '' 's|from "@/components/SessionWrapper"|from "@/components/common/layout/SessionWrapper"|g' app/layout.tsx

# Fix app/login/page.tsx imports
echo "📝 Fixing app/login/page.tsx..."
sed -i '' 's|from "@/components/auth/LoginForm"|from "@/components/features/auth/components/LoginForm"|g' app/login/page.tsx

# Fix Navbar.tsx imports
echo "📝 Fixing Navbar.tsx..."
sed -i '' 's|from "@/components/auth/SignOutButton"|from "@/components/features/auth/components/SignOutButton"|g' components/common/layout/Navbar.tsx

# Fix QuizGenerator.tsx imports
echo "📝 Fixing QuizGenerator.tsx..."
sed -i '' 's|from "@/hooks/useQuiz"|from "@/components/features/quiz/hooks/useQuiz"|g' components/features/quiz/components/QuizGenerator.tsx
sed -i '' 's|from "@/components/SignInButton"|from "@/components/features/auth/components/SignInButton"|g' components/features/quiz/components/QuizGenerator.tsx

# Fix UserScore.tsx imports
echo "📝 Fixing UserScore.tsx..."
sed -i '' 's|from "@/hooks/useUser"|from "@/components/features/user/hooks/useUser"|g' components/features/user/components/UserScore.tsx

# Fix hook imports within quiz hooks
echo "📝 Fixing quiz hooks internal imports..."
if [ -f "components/features/quiz/hooks/useQuiz.ts" ]; then
    # Fix useUser import in useQuiz
    sed -i '' 's|from "./useUser"|from "@/components/features/user/hooks/useUser"|g' components/features/quiz/hooks/useQuiz.ts
    # Fix categories import (if it was moved)
    sed -i '' 's|from "@/lib/categories"|from "@/lib/constants/categories"|g' components/features/quiz/hooks/useQuiz.ts
fi

# Fix UI components that reference moved hooks
echo "📝 Fixing UI component hook imports..."
sed -i '' 's|from "@/hooks/use-mobile"|from "@/lib/hooks/use-mobile"|g' components/ui/sidebar.tsx
sed -i '' 's|from "@/hooks/use-toast"|from "@/lib/hooks/use-toast"|g' components/ui/toaster.tsx

# Update components.json to reflect new structure
echo "📝 Updating components.json..."
sed -i '' 's|"hooks": "@/hooks"|"hooks": "@/lib/hooks"|g' components.json

echo "✅ Import paths fixed!"
echo ""
echo "📋 Fixed imports in:"
echo "├── app/page.tsx"
echo "├── app/layout.tsx" 
echo "├── app/login/page.tsx"
echo "├── components/common/layout/Navbar.tsx"
echo "├── components/features/quiz/components/QuizGenerator.tsx"
echo "├── components/features/user/components/UserScore.tsx"
echo "├── components/features/quiz/hooks/useQuiz.ts"
echo "├── components/ui/sidebar.tsx"
echo "├── components/ui/toaster.tsx"
echo "└── components.json"
echo ""
echo "🎯 Next: Run 'npm run dev' to test if everything works!"