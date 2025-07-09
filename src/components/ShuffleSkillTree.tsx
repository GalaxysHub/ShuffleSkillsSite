import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Lock,
  PlayArrow,
  Star,
  Timeline,
} from "@mui/icons-material";
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ShuffleMove {
  id: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  unlocks: string[];
  description: string;
  keyPoints: string[];
  videoId?: string;
  completed?: boolean;
  position: { x: number; y: number };
}

const shuffleMoves: ShuffleMove[] = [
  // Foundation Moves (Level 1)
  {
    id: "running-man",
    name: "Running Man",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: ["reverse-running-man", "running-man-variations"],
    description:
      "The most fundamental shuffle move - alternating heel-toe steps",
    keyPoints: ["Keep knees loose", "Slide back foot", "Maintain rhythm"],
    position: { x: 400, y: 50 },
    completed: false,
  },
  {
    id: "t-step",
    name: "T-Step",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: ["reverse-t-step"],
    description: "Side-to-side movement forming a T shape with your feet",
    keyPoints: ["Wide stance", "Sharp direction changes", "Maintain balance"],
    position: { x: 750, y: 50 },
    completed: false,
  },
  {
    id: "charleston",
    name: "Charleston",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: ["fast-heel-toe", "spin-heel-toe"],
    description: "Classic dance move adapted for shuffle - kick and step pattern",
    keyPoints: ["High energy kicks", "Precise timing", "Smooth transitions"],
    position: { x: 50, y: 50 },
    completed: false,
  },
  {
    id: "reverse-running-man",
    name: "Reverse Running Man",
    difficulty: "beginner",
    prerequisites: ["running-man"],
    unlocks: ["running-man-variations"],
    description:
      "Running man performed backwards - alternating heel-toe steps in reverse",
    keyPoints: ["Keep knees loose", "Step back first", "Maintain backward flow"],
    position: { x: 400, y: 180 },
    completed: false,
  },
  {
    id: "reverse-t-step",
    name: "Reverse T-Step",
    difficulty: "beginner",
    prerequisites: ["t-step"],
    unlocks: ["running-man-variations", "t-step-variations"],
    description: "T-Step performed in reverse direction with backward flow",
    keyPoints: ["Maintain wide stance", "Reverse direction changes", "Backward balance"],
    position: { x: 750, y: 180 },
    completed: false,
  },
  {
    id: "running-man-variations",
    name: "Running Man Variations",
    difficulty: "intermediate",
    prerequisites: ["running-man", "reverse-running-man", "reverse-t-step"],
    unlocks: ["freestyle"],
    description:
      "Various styles and modifications of the running man and t-step",
    keyPoints: ["Forward/backward steps", "Side variations", "Smooth transitions"],
    position: { x: 575, y: 320 },
    completed: false,
  },

  // Intermediate Combinations (Level 2)
  {
    id: "fast-heel-toe",
    name: "Fast Heel-Toe",
    difficulty: "intermediate",
    prerequisites: ["charleston"],
    unlocks: ["spin-heel-toe"],
    description: "Accelerated version of heel-toe with rapid fire steps",
    keyPoints: ["Double time rhythm", "Light on feet", "Controlled speed"],
    position: { x: 50, y: 320 },
    completed: false,
  },
  {
    id: "t-step-variations",
    name: "T-Step Variations",
    difficulty: "intermediate",
    prerequisites: ["t-step", "reverse-t-step"],
    unlocks: ["freestyle"],
    description: "Creative variations and combinations of t-step movements",
    keyPoints: ["Style expression", "Direction changes", "Flow combinations"],
    position: { x: 750, y: 320 },
    completed: false,
  },

  // Advanced Moves (Level 3)
  {
    id: "spin-heel-toe",
    name: "Spinning Heel-Toe",
    difficulty: "advanced",
    prerequisites: ["charleston", "fast-heel-toe"],
    unlocks: ["freestyle"],
    description: "Heel-toe combined with 360-degree spins",
    keyPoints: [
      "Maintain rhythm while spinning",
      "Spot turns",
      "Balance control",
    ],
    position: { x: 50, y: 480 },
    completed: false,
  },

  // Master Level (Level 4)
  {
    id: "freestyle",
    name: "Freestyle Flow",
    difficulty: "advanced",
    prerequisites: ["spin-heel-toe", "running-man-variations", "t-step-variations"],
    unlocks: [],
    description: "Creative combination of all moves with personal style",
    keyPoints: [
      "Smooth transitions",
      "Personal expression",
      "Musical interpretation",
    ],
    position: { x: 400, y: 620 },
    completed: false,
  },
];

const ShuffleSkillTree: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [selectedMove, setSelectedMove] = useState<ShuffleMove | null>(null);
  const [completedMoves, setCompletedMoves] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const progress = userData.progress || {};
          setCompletedMoves(new Set(Object.keys(progress).filter(key => progress[key])));
        }
      }
      setLoading(false);
    };

    loadProgress();
  }, [currentUser]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return theme.palette.success.main;
      case "intermediate":
        return theme.palette.warning.main;
      case "advanced":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const isUnlocked = (move: ShuffleMove) => {
    return move.prerequisites.every((prereq) => completedMoves.has(prereq));
  };

  const saveProgress = async (newCompleted: Set<string>) => {
    if (currentUser) {
      try {
        const progressObj: { [key: string]: boolean } = {};
        shuffleMoves.forEach(move => {
          progressObj[move.id] = newCompleted.has(move.id);
        });
        
        await setDoc(doc(db, 'users', currentUser.uid), {
          progress: progressObj
        }, { merge: true });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const toggleComplete = async (moveId: string) => {
    const newCompleted = new Set(completedMoves);
    if (newCompleted.has(moveId)) {
      newCompleted.delete(moveId);
      // Also remove any moves that depend on this one
      shuffleMoves.forEach((move) => {
        if (move.prerequisites.includes(moveId)) {
          newCompleted.delete(move.id);
        }
      });
    } else {
      newCompleted.add(moveId);
    }
    setCompletedMoves(newCompleted);
    
    // Only save to Firebase if user is logged in
    if (currentUser) {
      await saveProgress(newCompleted);
    }
  };

  const getConnectionLines = () => {
    const lines: React.ReactElement[] = [];

    shuffleMoves.forEach((move) => {
      move.unlocks.forEach((unlockedMoveId) => {
        const unlockedMove = shuffleMoves.find((m) => m.id === unlockedMoveId);
        if (unlockedMove) {
          const startX = move.position.x + 75; // Center of move card
          const startY = move.position.y + 60;
          const endX = unlockedMove.position.x + 75;
          const endY = unlockedMove.position.y + 60;

          lines.push(
            <line
              key={`${move.id}-${unlockedMoveId}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={
                completedMoves.has(move.id)
                  ? theme.palette.primary.main
                  : theme.palette.grey[300]
              }
              strokeWidth={completedMoves.has(move.id) ? 3 : 2}
              strokeDasharray={completedMoves.has(move.id) ? "0" : "5,5"}
            />
          );
        }
      });
    });

    return lines;
  };

  if (loading) {
    return <Box>Loading progress...</Box>;
  }

  return (
    <Box>
      {/* Legend */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Chip
          icon={<Star />}
          label="Beginner"
          sx={{
            backgroundColor: getDifficultyColor("beginner"),
            color: "white",
          }}
        />
        <Chip
          icon={<Timeline />}
          label="Intermediate"
          sx={{
            backgroundColor: getDifficultyColor("intermediate"),
            color: "white",
          }}
        />
        <Chip
          icon={<CheckCircle />}
          label="Advanced"
          sx={{
            backgroundColor: getDifficultyColor("advanced"),
            color: "white",
          }}
        />
      </Box>

      {/* Skill Tree Visualization */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "750px",
          overflow: "auto",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        <svg
          width="1000"
          height="750"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        >
          {/* Y-axis labels with colored backgrounds */}
          <rect
            x="5"
            y="50"
            width="25"
            height="70"
            fill={getDifficultyColor("beginner")}
            opacity="0.8"
            rx="4"
          />
          <text
            x="17"
            y="85"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90 17 85)"
          >
            Beginner
          </text>
          
          <rect
            x="5"
            y="320"
            width="25"
            height="90"
            fill={getDifficultyColor("intermediate")}
            opacity="0.8"
            rx="4"
          />
          <text
            x="17"
            y="365"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90 17 365)"
          >
            Intermediate
          </text>
          
          <rect
            x="5"
            y="480"
            width="25"
            height="70"
            fill={getDifficultyColor("advanced")}
            opacity="0.8"
            rx="4"
          />
          <text
            x="17"
            y="515"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90 17 515)"
          >
            Advanced
          </text>
          
          {/* Optional: Add horizontal guide lines */}
          <line
            x1="0"
            y1="120"
            x2="1000"
            y2="120"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="0"
            y1="380"
            x2="1000"
            y2="380"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="0"
            y1="550"
            x2="1000"
            y2="550"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />
          
          {getConnectionLines()}
        </svg>

        {shuffleMoves.map((move) => {
          const isCompleted = completedMoves.has(move.id);
          const isLocked = !isUnlocked(move);

          return (
            <Card
              key={move.id}
              sx={{
                position: "absolute",
                left: move.position.x,
                top: move.position.y,
                width: 150,
                height: 120,
                cursor: "pointer",
                zIndex: 2,
                border: isCompleted
                  ? `3px solid ${theme.palette.primary.main}`
                  : "1px solid #ddd",
                opacity: isLocked && !isCompleted ? 0.5 : 1,
                backgroundColor: isCompleted
                  ? theme.palette.primary.light
                  : "white",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: theme.shadows[8],
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedMove(move)}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
                  >
                    {move.name}
                  </Typography>
                  {isCompleted ? (
                    <CheckCircle color="primary" fontSize="small" />
                  ) : isLocked ? (
                    <Lock color="disabled" fontSize="small" />
                  ) : (
                    <PlayArrow color="action" fontSize="small" />
                  )}
                </Box>

                <Chip
                  size="small"
                  label={move.difficulty}
                  sx={{
                    backgroundColor: getDifficultyColor(move.difficulty),
                    color: "white",
                    fontSize: "0.7rem",
                    height: "20px",
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "text.secondary" }}
                >
                  {move.description.substring(0, 40)}...
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Move Details Dialog */}
      <Dialog
        open={!!selectedMove}
        onClose={() => setSelectedMove(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMove && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">{selectedMove.name}</Typography>
                <Chip
                  label={selectedMove.difficulty}
                  sx={{
                    backgroundColor: getDifficultyColor(
                      selectedMove.difficulty
                    ),
                    color: "white",
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedMove.description}
              </Typography>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Key Learning Points:
              </Typography>
              <Box component="ul" sx={{ mb: 2 }}>
                {selectedMove.keyPoints.map((point, index) => (
                  <li key={index}>
                    <Typography variant="body2">{point}</Typography>
                  </li>
                ))}
              </Box>

              {selectedMove.prerequisites.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Prerequisites:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    {selectedMove.prerequisites.map((prereq) => {
                      const prereqMove = shuffleMoves.find(
                        (m) => m.id === prereq
                      );
                      return (
                        <Chip
                          key={prereq}
                          label={prereqMove?.name || prereq}
                          color={
                            completedMoves.has(prereq) ? "success" : "default"
                          }
                          size="small"
                        />
                      );
                    })}
                  </Box>
                </>
              )}

              {selectedMove.unlocks.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Unlocks:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {selectedMove.unlocks.map((unlock) => {
                      const unlockMove = shuffleMoves.find(
                        (m) => m.id === unlock
                      );
                      return (
                        <Chip
                          key={unlock}
                          label={unlockMove?.name || unlock}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      );
                    })}
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => toggleComplete(selectedMove.id)}
                variant={
                  completedMoves.has(selectedMove.id) ? "outlined" : "contained"
                }
                disabled={!isUnlocked(selectedMove)}
              >
                {completedMoves.has(selectedMove.id)
                  ? "Mark Incomplete"
                  : "Mark Complete"}
                {!currentUser && " (Not Saved)"}
              </Button>
              <Button onClick={() => setSelectedMove(null)}>Close</Button>
            </DialogActions>
            {!currentUser && (
              <Box sx={{ p: 2, pt: 0 }}>
                <Alert severity="warning">
                  <Typography variant="body2">
                    Progress won't be saved unless you're logged in. 
                    <Button size="small" onClick={() => window.location.href = '/login'}>
                      Login here
                    </Button>
                  </Typography>
                </Alert>
              </Box>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ShuffleSkillTree;