# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:5174)
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build

### Testing
There are no automated tests configured in this project yet.

## Architecture Overview

This is a React 19 + TypeScript shuffle dance skill tree web application using Firebase for authentication and data persistence.

### Core Technologies
- **Frontend**: React 19, TypeScript, Material-UI (MUI), ReactFlow for skill tree visualization
- **Backend**: Firebase (Authentication, Firestore database, Storage)
- **Build**: Vite with React plugin
- **Styling**: Material-UI with custom cyberpunk-inspired theming

### Project Structure
```
src/
├── components/          # Reusable React components
│   ├── AuthModal.tsx    # Login/signup modal
│   ├── ShuffleSkillTree.tsx  # Main skill tree visualization (large component ~1700 lines)
│   ├── ShuffleMoveNode.tsx   # Individual move node for ReactFlow
│   └── ...
├── contexts/
│   └── AuthContext.tsx  # Firebase authentication context
├── config/
│   └── firebase.ts      # Firebase configuration and exports
├── pages/               # Page-level components for routing
├── utils/
│   └── storage.ts       # Storage utilities
└── App.tsx             # Main app with routing, theming, and providers
```

### Key Components

**ShuffleSkillTree.tsx** - The main application component featuring:
- Interactive skill tree using ReactFlow library
- 60+ predefined shuffle dance moves with prerequisites/unlocks
- Progress tracking with Firebase sync
- Filtering by style (Melbourne/Shapes), move type (kicks/spins/slides), difficulty
- Goals system for move targeting
- Sub-component tracking for complex moves

**AuthContext.tsx** - Handles Firebase authentication:
- Email/password and Google OAuth
- Automatic user document creation in Firestore
- Progress syncing between devices

### Firebase Integration
- **Authentication**: Email/password and Google OAuth
- **Firestore**: User profiles with progress tracking (`users/{uid}`)
- **Storage**: GIF assets for move demonstrations
- Users collection schema: `{ email, displayName, progress: {moveId: boolean}, goals: {moveId: boolean}, subComponentProgress: {moveId: {subId: boolean}} }`

### Data Models
- **ShuffleMove**: Each move has id, name, difficulty, prerequisites[], unlocks[], description, keyPoints[], position{x,y}, styles[], tags[], optional subComponents[]
- Progress is stored as boolean flags per move ID
- Prerequisites must be completed before a move becomes unlockable

### Development Notes
- Uses Vite dev server on port 5174
- Material-UI theme supports both light and dark modes with cyberpunk styling
- ReactFlow handles the skill tree visualization and interactions
- Progress persists to localStorage for non-authenticated users
- All moves are statically defined in ShuffleSkillTree.tsx (lines 72-634)

### Deployment
- Built for Vercel (vercel.json present)
- Firebase hosting configuration available
- Production builds to `dist/` directory