import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Alert, Stack } from "@mui/material";
import { School, TrendingUp, Star } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import ShuffleSkillTree from "../components/ShuffleSkillTree";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import HelpNotification from "../components/HelpNotification";

const SkillTreePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({
    beginner: { completed: 0, total: 10 },
    intermediate: { completed: 0, total: 9 },
    advanced: { completed: 0, total: 2 },
  });

  // Function to calculate progress from goals and completed moves
  const calculateProgress = (userProgress: any, userGoals: any) => {
    // Get all goals by difficulty
    const beginnerGoals = Object.keys(userGoals).filter(moveId => {
      return userGoals[moveId] && ["running-man", "t-step", "charleston", "reverse-running-man", "reverse-t-step", "polly-pocket", "half-step-variations", "shaper-t-step", "cowtail", "w-m-step", "v-step"].includes(moveId);
    });
    const intermediateGoals = Object.keys(userGoals).filter(moveId => {
      return userGoals[moveId] && ["t-step-variations", "bree-spins", "frontside-kickspin", "sacco-kicks", "mikki-kicks", "front-kick", "front-hook-kick", "back-hook-kick", "moonwalk", "circle-glide", "side-glide"].includes(moveId);
    });
    const advancedGoals = Object.keys(userGoals).filter(moveId => {
      return userGoals[moveId] && ["frontside-kickspin", "back-kick", "backside-kickspin"].includes(moveId);
    });

    // Get completed non-goals for each difficulty level
    const beginnerCompletedNonGoals = Object.keys(userProgress).filter(moveId => 
      userProgress[moveId] && 
      ["running-man", "t-step", "charleston", "reverse-running-man", "reverse-t-step", "polly-pocket", "half-step-variations", "shaper-t-step", "cowtail", "w-m-step", "v-step"].includes(moveId) && 
      !userGoals[moveId]
    );

    const intermediateCompletedNonGoals = Object.keys(userProgress).filter(moveId => 
      userProgress[moveId] && 
      ["t-step-variations", "bree-spins", "frontside-kickspin", "sacco-kicks", "mikki-kicks", "front-kick", "front-hook-kick", "back-hook-kick", "moonwalk", "circle-glide", "side-glide"].includes(moveId) && 
      !userGoals[moveId]
    );

    const advancedCompletedNonGoals = Object.keys(userProgress).filter(moveId => 
      userProgress[moveId] && 
      ["frontside-kickspin", "back-kick", "backside-kickspin"].includes(moveId) && 
      !userGoals[moveId]
    );

    // Count completed goals + completed non-goals
    const beginnerCompleted = beginnerGoals.filter(moveId => userProgress[moveId]).length + beginnerCompletedNonGoals.length;
    const intermediateCompleted = intermediateGoals.filter(moveId => userProgress[moveId]).length + intermediateCompletedNonGoals.length;
    const advancedCompleted = advancedGoals.filter(moveId => userProgress[moveId]).length + advancedCompletedNonGoals.length;

    // Total includes goals + any completed moves that weren't goals
    const beginnerTotal = beginnerGoals.length + beginnerCompletedNonGoals.length;
    const intermediateTotal = intermediateGoals.length + intermediateCompletedNonGoals.length;
    const advancedTotal = advancedGoals.length + advancedCompletedNonGoals.length;

    return {
      beginner: {
        completed: beginnerCompleted,
        total: beginnerTotal,
      },
      intermediate: {
        completed: intermediateCompleted,
        total: intermediateTotal,
      },
      advanced: {
        completed: advancedCompleted,
        total: advancedTotal,
      },
    };
  };

  // Callback for optimistic updates from ShuffleSkillTree
  const handleProgressUpdate = (completedMoves: Set<string>, goals: Set<string>) => {
    const userProgress: any = {};
    const userGoals: any = {};
    
    // Convert Sets to object format expected by calculateProgress
    completedMoves.forEach(moveId => {
      userProgress[moveId] = true;
    });
    goals.forEach(moveId => {
      userGoals[moveId] = true;
    });

    const newProgress = calculateProgress(userProgress, userGoals);
    setProgress(newProgress);
  };

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProgress = userData.progress || {};
          const userGoals = userData.goals || {};

          const newProgress = calculateProgress(userProgress, userGoals);
          setProgress(newProgress);
        }
      }
    };

    loadProgress();
  }, [currentUser]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Navbar */}
      <Navbar />

      <Box
        sx={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200, mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              <School sx={{ mr: 2, verticalAlign: "middle" }} />
              Shuffle Learning Path
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Interactive skill tree showing the optimal progression for
              learning shuffle dance moves
            </Typography>
          </Box>


          {/* Help Notification */}
          <HelpNotification />

          {/* Statistics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
              {currentUser ? "Your Goal Progress" : "Goal Progress"}
            </Typography>
            {currentUser ? (
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {progress.beginner.completed}/{progress.beginner.total}
                  </Typography>
                  <Typography variant="caption">Beginner Goals</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {progress.intermediate.completed}/
                    {progress.intermediate.total}
                  </Typography>
                  <Typography variant="caption">Intermediate Goals</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="error.main">
                    {progress.advanced.completed}/{progress.advanced.total}
                  </Typography>
                  <Typography variant="caption">Advanced Goals</Typography>
                </Box>
              </Stack>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Login to set goals and track your progress!</strong> Set personal learning goals
                  and see your completion progress. Completed moves that aren't goals also count as bonus progress.
                </Typography>
              </Alert>
            )}
            {currentUser && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Progress shows completed goals plus any extra moves you've mastered. 
                Set goals to personalize your learning journey!
              </Typography>
            )}
          </Paper>

          {/* Skill Tree */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Star sx={{ mr: 1, verticalAlign: "middle" }} />
              Shuffle Move Progression
            </Typography>
            <ShuffleSkillTree onProgressUpdate={handleProgressUpdate} />
          </Paper>

          {/* Learning Tips */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              💡 Learning Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Start with foundations:</strong> Master Running Man,
                  T-Step, and Heel-Toe before moving to intermediate moves
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Practice prerequisites:</strong> Each move builds on
                  previous skills - don't skip steps
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Combine gradually:</strong> Once you master individual
                  moves, practice smooth transitions
                </Typography>
              </li>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default SkillTreePage;
