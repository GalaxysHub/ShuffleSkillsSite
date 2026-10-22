# Shuffle Skill Tree WebApp

An interactive web application for tracking shuffle dance learning progress using a skill tree visualization.

Built with ❤️ for the shuffle dance community.

## Features

- **User Authentication**: Sign up/login with email or Google
- **Interactive Skill Tree**: Visual representation of shuffle dance moves with prerequisites
- **Progress Tracking**: Mark moves as completed and track your learning journey
- **Real-time Updates**: Progress is saved to Firebase and synced across devices
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Backend**: Firebase (Auth, Firestore)
- **Build Tool**: Vite
- **Styling**: Material-UI with custom theme

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5174 in your browser

## Project Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx
│   └── ShuffleSkillTree.tsx
├── contexts/
│   └── AuthContext.tsx
├── config/
│   └── firebase.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── SkillTreePage.tsx
├── App.tsx
└── main.tsx
```

## How to Use

1. **Sign Up/Login**: Create an account or sign in with Google
2. **View Skill Tree**: See all shuffle dance moves organized by difficulty
3. **Track Progress**: Click on moves to mark them as completed
4. **Prerequisites**: Locked moves require completing prerequisites first
5. **Visual Progress**: Connection lines show your learning path

## Shuffle Moves Included

- **Beginner**: Running Man, T-Step, Charleston, Reverse Running Man, Reverse T-Step
- **Intermediate**: Fast Heel-Toe, Running Man Variations, T-Step Variations
- **Advanced**: Spinning Heel-Toe, Freestyle Flow

## Firebase Configuration

The app uses Firebase for authentication and data storage. The client config lives in `src/config/firebase.ts`; point it at your own Firebase project. Firebase web API keys are public identifiers rather than secrets, but restrict them to your domains in the Google Cloud console.

## Building for Production

```bash
npm run build
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

It is a companion to [Shuffle-Tutorial-Web-App](https://github.com/GalaxysHub/Shuffle-Tutorial-Web-App).