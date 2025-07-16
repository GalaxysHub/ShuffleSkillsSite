import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Alert, Stack } from "@mui/material";
import { School, TrendingUp, Star } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import ShuffleSkillTree from "../components/ShuffleSkillTree";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const SkillTreePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({
    beginner: { completed: 0, total: 10 },
    intermediate: { completed: 0, total: 9 },
    advanced: { completed: 0, total: 2 },
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProgress = userData.progress || {};

          // Count completed moves by difficulty
          const beginnerMoves = [
            "running-man",
            "t-step",
            "charleston",
            "reverse-running-man",
            "reverse-t-step",
            "polly-pocket",
            "half-step-variations",
            "shaper-t-step",
            "cowtail",
            "w-m-step",
          ];
          const intermediateMoves = [
            "t-step-variations",
            "bree-spins",
            "frontside-kickspin",
            "sacco-kicks",
            "hammer-kick",
            "180-backside-kickspin",
            "moonwalk",
            "circle-glide",
            "side-glide",
          ];
          const advancedMoves: string[] = [
            "spinning-backkick",
            "360-frontside-kickspin",
          ];

          const beginnerCompleted = beginnerMoves.filter(
            (move) => userProgress[move]
          ).length;
          const intermediateCompleted = intermediateMoves.filter(
            (move) => userProgress[move]
          ).length;
          const advancedCompleted = advancedMoves.filter(
            (move) => userProgress[move]
          ).length;

          setProgress({
            beginner: {
              completed: beginnerCompleted,
              total: beginnerMoves.length,
            },
            intermediate: {
              completed: intermediateCompleted,
              total: intermediateMoves.length,
            },
            advanced: {
              completed: advancedCompleted,
              total: advancedMoves.length,
            },
          });
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

          {/* Instructions */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>How to use:</strong> Click on any move to see details and
              mark as completed. Locked moves (🔒) require prerequisites to be
              completed first. Lines show the progression path between moves.
            </Typography>
          </Alert>

          {/* Statistics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
              {currentUser ? "Your Learning Progress" : "Learning Progress"}
            </Typography>
            {currentUser ? (
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {progress.beginner.completed}/{progress.beginner.total}
                  </Typography>
                  <Typography variant="caption">Beginner Moves</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {progress.intermediate.completed}/
                    {progress.intermediate.total}
                  </Typography>
                  <Typography variant="caption">Intermediate Moves</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="error.main">
                    {progress.advanced.completed}/{progress.advanced.total}
                  </Typography>
                  <Typography variant="caption">Advanced Moves</Typography>
                </Box>
              </Stack>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Login to track your progress!</strong> You can explore
                  all moves below, but your progress won't be saved unless
                  you're logged in.
                </Typography>
              </Alert>
            )}
          </Paper>

          {/* Skill Tree */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Star sx={{ mr: 1, verticalAlign: "middle" }} />
              Shuffle Move Progression
            </Typography>
            <ShuffleSkillTree />
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
