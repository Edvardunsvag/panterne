#!/bin/bash

# Script to create the new frontend folder structure
# Run this from the frontend directory: chmod +x setup-structure.sh && ./setup-structure.sh

echo "🚀 Creating new frontend folder structure..."

# Create the main feature directories under components
mkdir -p components/common/layout
mkdir -p components/features/auth/components
mkdir -p components/features/auth/hooks
mkdir -p components/features/auth/types
mkdir -p components/features/quiz/components
mkdir -p components/features/quiz/hooks
mkdir -p components/features/quiz/types
mkdir -p components/features/leaderboard/components
mkdir -p components/features/leaderboard/hooks
mkdir -p components/features/leaderboard/types
mkdir -p components/features/user/components
mkdir -p components/features/user/hooks
mkdir -p components/features/user/types

# Create the new lib structure
mkdir -p lib/api/endpoints
mkdir -p lib/constants
mkdir -p lib/types
mkdir -p lib/utils
mkdir -p lib/hooks

# Create placeholder files to ensure directories are tracked by git
touch components/common/layout/.gitkeep
touch components/features/auth/components/.gitkeep
touch components/features/auth/hooks/.gitkeep
touch components/features/auth/types/.gitkeep
touch components/features/quiz/components/.gitkeep
touch components/features/quiz/hooks/.gitkeep
touch components/features/quiz/types/.gitkeep
touch components/features/leaderboard/components/.gitkeep
touch components/features/leaderboard/hooks/.gitkeep
touch components/features/leaderboard/types/.gitkeep
touch components/features/user/components/.gitkeep
touch components/features/user/hooks/.gitkeep
touch components/features/user/types/.gitkeep
touch lib/api/endpoints/.gitkeep
touch lib/constants/.gitkeep
touch lib/types/.gitkeep
touch lib/hooks/.gitkeep

echo "✅ Folder structure created successfully!"
echo ""
echo "📁 New structure created:"
echo "├── components/"
echo "│   ├── ui/ (existing - shadcn/ui components)"
echo "│   ├── common/"
echo "│   │   └── layout/"
echo "│   └── features/"
echo "│       ├── auth/"
echo "│       │   ├── components/"
echo "│       │   ├── hooks/"
echo "│       │   └── types/"
echo "│       ├── quiz/"
echo "│       │   ├── components/"
echo "│       │   ├── hooks/"
echo "│       │   └── types/"
echo "│       ├── leaderboard/"
echo "│       │   ├── components/"
echo "│       │   ├── hooks/"
echo "│       │   └── types/"
echo "│       └── user/"
echo "│           ├── components/"
echo "│           ├── hooks/"
echo "│           └── types/"
echo "├── lib/"
echo "│   ├── api/"
echo "│   │   └── endpoints/"
echo "│   ├── constants/"
echo "│   ├── types/"
echo "│   ├── utils/"
echo "│   ├── hooks/"
echo "│   └── generated/ (existing)"
echo ""
echo "🎯 Next steps:"
echo "1. Run this script to create the folders"
echo "2. Move components to their new locations (Phase 2)"
echo "3. Split API client into feature-specific files (Phase 3)"
echo "4. Move hooks to appropriate feature folders (Phase 4)"
echo "5. Extract constants and create type definitions (Phase 5)"
echo "6. Update import paths (Phase 6)" 