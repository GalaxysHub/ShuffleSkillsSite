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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  CheckCircle,
  Lock,
  PlayArrow,
  Star,
  Timeline,
  Fullscreen,
  FullscreenExit,
  Flag,
  FlagOutlined,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthModal from "./AuthModal";

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
  styles: ("melbourne" | "shapes")[];
  tags?: ("kick" | "spins" | "slides")[];
  subComponents?: {
    id: string;
    name: string;
    description: string;
    completed?: boolean;
  }[];
  category?: string;
}

interface Category {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prerequisites: string[];
}

const categories: Category[] = [
  {
    id: "kick-spins-category",
    name: "Kick Spins",
    position: { x: 1390, y: 350 },
    size: { width: 320, height: 220 },
    prerequisites: ["running-man", "t-step"],
  },
  {
    id: "slides-category",
    name: "Glides",
    position: { x: 1740, y: 360 },
    size: { width: 250, height: 180 },
    prerequisites: ["running-man"],
  },
];

const shuffleMoves: ShuffleMove[] = [
  // Foundation Moves (Level 1)
  {
    id: "running-man",
    name: "Running Man",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: [
      "reverse-running-man",
      "polly-pocket",
      "bree-spins",
      "half-step-variations",
      "hammer-kick",
    ],
    description:
      "The most fundamental shuffle move - alternating heel-toe steps",
    keyPoints: ["Keep weight on balls of feet", "2 steps", "Maintain rhythm"],
    position: { x: 550, y: 50 },
    completed: false,
    styles: ["melbourne", "shapes"],
    tags: ["slides"],
  },
  {
    id: "t-step",
    name: "T-Step",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: [
      "reverse-t-step",
      "t-step-variations",
      "shaper-t-step",
      "sacco-kicks",
      "w-m-step",
    ],
    description: "Side-to-side movement forming a T shape with your feet",
    keyPoints: ["Wide stance", "Sharp direction changes", "Maintain balance"],
    position: { x: 950, y: 50 },
    completed: false,
    styles: ["melbourne", "shapes"],
  },
  {
    id: "charleston",
    name: "Charleston",
    difficulty: "beginner",
    prerequisites: [],
    unlocks: ["cowtail"],
    description:
      "Classic dance move adapted for shuffle - kick and step pattern",
    keyPoints: ["High energy kicks", "Precise timing", "Smooth transitions"],
    position: { x: 150, y: 50 },
    completed: false,
    styles: ["shapes"],
  },
  {
    id: "reverse-running-man",
    name: "Reverse Running Man",
    difficulty: "beginner",
    prerequisites: ["running-man"],
    unlocks: ["bree-spins"],
    description: "Running man performed backwards",
    keyPoints: [
      "Keep weight on balls of feet",
      "Step back first",
      "Maintain backward flow",
    ],
    position: { x: 450, y: 180 },
    completed: false,
    styles: ["melbourne", "shapes"],
  },
  {
    id: "reverse-t-step",
    name: "Reverse T-Step",
    difficulty: "beginner",
    prerequisites: ["t-step"],
    unlocks: [],
    description: "T-Step performed in reverse direction with backward flow",
    keyPoints: [
      "Maintain wide stance",
      "Reverse direction changes",
      "Backward balance",
    ],
    position: { x: 850, y: 250 },
    completed: false,
    styles: ["melbourne", "shapes"],
  },
  {
    id: "shaper-t-step",
    name: "Shaper T-Step",
    difficulty: "beginner",
    prerequisites: ["t-step"],
    unlocks: [],
    description:
      "Shapes-focused variation of T-Step with emphasis on geometric patterns",
    keyPoints: ["Sharp geometric shapes", "Precise angles", "Clean lines"],
    position: { x: 1000, y: 250 },
    completed: false,
    styles: ["shapes"],
  },
  {
    id: "polly-pocket",
    name: "Polly Pocket/X-Step",
    difficulty: "beginner",
    prerequisites: ["running-man"],
    unlocks: [],
    description: "Compact, tight variation of running man with smaller steps",
    keyPoints: [
      "Small, controlled movements",
      "Stay low",
      "Keep feet close together",
    ],
    position: { x: 550, y: 180 },
    completed: false,
    styles: ["melbourne", "shapes"],
  },
  {
    id: "half-step-variations",
    name: "Half Step Variations",
    difficulty: "beginner",
    prerequisites: ["running-man"],
    unlocks: [],
    description: "Various styles and modifications of half step movements",
    keyPoints: [
      "Forward/backward steps",
      "Side variations",
      "Smooth transitions",
    ],
    position: { x: 650, y: 180 },
    completed: false,
    styles: ["melbourne"],
    subComponents: [
      {
        id: "forward-step",
        name: "Forward Step",
        description:
          "Basic forward stepping motion fundamental to shuffle dance",
        completed: false,
      },
      {
        id: "back-step",
        name: "Back Step",
        description:
          "Basic backward stepping motion building on reverse running man",
        completed: false,
      },
    ],
  },
  {
    id: "cowtail",
    name: "Cowtail",
    difficulty: "beginner",
    prerequisites: ["charleston"],
    unlocks: [],
    description:
      "Classic shapes move with sharp directional changes and precise footwork",
    keyPoints: [
      "Sharp direction changes",
      "Precise foot placement",
      "Geometric patterns",
    ],
    position: { x: 100, y: 180 },
    completed: false,
    styles: ["shapes"],
  },
  {
    id: "w-m-step",
    name: "W/M Step",
    difficulty: "beginner",
    prerequisites: ["t-step"],
    unlocks: [],
    description:
      "Shapes-focused movement pattern creating W and M formations with precise footwork",
    keyPoints: [
      "W/M patterns",
      "Clean lines",
      "Geometric precision",
      "Foot positioning",
    ],
    position: { x: 1150, y: 250 },
    completed: false,
    styles: ["shapes"],
  },

  // Intermediate Combinations (Level 2)
  {
    id: "t-step-variations",
    name: "T-Step Variations",
    difficulty: "intermediate",
    prerequisites: ["t-step"],
    unlocks: [],
    description: "Creative variations and combinations of t-step movements",
    keyPoints: ["Style expression", "Direction changes", "Flow combinations"],
    position: { x: 900, y: 380 },
    completed: false,
    styles: ["melbourne"],
    subComponents: [
      {
        id: "back",
        name: "Back",
        description: "T-step variation with back movement pattern",
        completed: false,
      },
      {
        id: "over",
        name: "Over",
        description: "T-step variation with over movement pattern",
        completed: false,
      },
      {
        id: "front",
        name: "Front",
        description: "T-step variation with front movement pattern",
        completed: false,
      },
    ],
  },
  {
    id: "bree-spins",
    name: "Bree Spins",
    difficulty: "intermediate",
    prerequisites: ["running-man", "reverse-running-man"],
    unlocks: ["spinning-backkick"],
    description:
      "Spinning variation combining running man with circular movements",
    keyPoints: [
      "Maintain running man rhythm",
      "Controlled spins",
      "Smooth transitions",
    ],
    position: { x: 450, y: 380 },
    completed: false,
    styles: ["melbourne"],
    tags: ["spins", "slides"],
    subComponents: [
      {
        id: "clockwise",
        name: "Clockwise",
        description: "Bree spins performed in clockwise rotation",
        completed: false,
      },
      {
        id: "counter-clockwise",
        name: "Counter Clockwise",
        description: "Bree spins performed in counter clockwise rotation",
        completed: false,
      },
    ],
  },
  {
    id: "frontside-kickspin",
    name: "180 Frontside Kick",
    difficulty: "intermediate",
    prerequisites: ["running-man", "t-step"],
    unlocks: ["360-frontside-kickspin"],
    description:
      "Advanced kick variation with frontside rotation and precise kick timing",
    keyPoints: [
      "Frontside rotation",
      "Kick timing",
      "Smooth flow",
      "Balance control",
    ],
    position: { x: 1420, y: 390 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick", "spins"],
    category: "kick-spins-category",
  },
  {
    id: "180-backside-kickspin",
    name: "Back Kick/180 Backside Kick",
    difficulty: "intermediate",
    prerequisites: ["running-man", "t-step"],
    unlocks: [],
    description:
      "Advanced 180-degree backside kickspin with precise rotation and landing control",
    keyPoints: [
      "180-degree rotation",
      "Backside technique",
      "Landing control",
      "Momentum management",
    ],
    position: { x: 1580, y: 390 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick", "spins"],
    category: "kick-spins-category",
  },
  {
    id: "sacco-kicks",
    name: "Sacco Kicks",
    difficulty: "intermediate",
    prerequisites: ["t-step"],
    unlocks: [],
    description:
      "Dynamic kicking variation building on t-step foundation with precise kick timing",
    keyPoints: [
      "Sharp kicks",
      "T-step base",
      "Rhythm control",
      "Leg positioning",
    ],
    position: { x: 1100, y: 380 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick"],
  },
  {
    id: "hammer-kick",
    name: "Hammer Kick",
    difficulty: "intermediate",
    prerequisites: ["running-man"],
    unlocks: [],
    description:
      "Powerful kicking variation building on running man with explosive hammer-like kicks",
    keyPoints: [
      "Explosive kicks",
      "Running man base",
      "Power control",
      "Timing precision",
    ],
    position: { x: 550, y: 380 },
    completed: false,
    styles: ["melbourne", "shapes"],
    tags: ["kick", "spins"],
  },
  {
    id: "moonwalk",
    name: "Moonwalk",
    difficulty: "intermediate",
    prerequisites: [],
    unlocks: [],
    description:
      "Smooth backward sliding movement creating the illusion of walking backwards while moving forward",
    keyPoints: [
      "Smooth heel-toe transitions",
      "Weight transfer",
      "Sliding motion",
      "Maintain balance",
    ],
    position: { x: 1760, y: 380 },
    completed: false,
    styles: ["melbourne", "shapes"],
    tags: ["slides"],
    category: "slides-category",
  },
  {
    id: "circle-glide",
    name: "Circle Glide",
    difficulty: "intermediate",
    prerequisites: [],
    unlocks: [],
    description:
      "Circular sliding movement combining continuous motion with smooth directional changes",
    keyPoints: [
      "Circular motion",
      "Continuous sliding",
      "Smooth transitions",
      "Maintain momentum",
    ],
    position: { x: 1760, y: 500 },
    completed: false,
    styles: ["melbourne", "shapes"],
    tags: ["slides"],
    category: "slides-category",
    subComponents: [
      {
        id: "clockwise-glide",
        name: "Clockwise",
        description: "Circle glide performed in clockwise direction",
        completed: false,
      },
      {
        id: "counter-clockwise-glide",
        name: "Counter Clockwise",
        description: "Circle glide performed in counter clockwise direction",
        completed: false,
      },
    ],
  },
  {
    id: "side-glide",
    name: "Side Glide",
    difficulty: "intermediate",
    prerequisites: [],
    unlocks: [],
    description:
      "Side-to-side gliding movement with smooth directional transitions",
    keyPoints: [
      "Side-to-side motion",
      "Weight transfer",
      "Smooth transitions",
      "Directional control",
    ],
    position: { x: 1860, y: 440 },
    completed: false,
    styles: ["melbourne", "shapes"],
    tags: ["slides"],
    category: "slides-category",
    subComponents: [
      {
        id: "front-glide",
        name: "Front",
        description: "Forward side glide movement with controlled front motion",
        completed: false,
      },
      {
        id: "back-glide",
        name: "Back",
        description: "Backward side glide movement with controlled back motion",
        completed: false,
      },
    ],
  },

  // Advanced Moves (Level 3)
  {
    id: "spinning-backkick",
    name: "Spinning Back Kick",
    difficulty: "advanced",
    prerequisites: ["bree-spins"],
    unlocks: [],
    description:
      "Advanced spinning move combining back kick with rotational momentum from bree spins",
    keyPoints: [
      "Rotational control",
      "Kick timing",
      "Momentum management",
      "Balance precision",
    ],
    position: { x: 450, y: 600 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick", "spins", "slides"],
  },
  {
    id: "360-frontside-kickspin",
    name: "360 Frontside Kickspin",
    difficulty: "advanced",
    prerequisites: ["frontside-kickspin"],
    unlocks: [],
    description:
      "Full rotation frontside kickspin requiring advanced balance and rotational control",
    keyPoints: [
      "Full 360 rotation",
      "Sustained balance",
      "Kick precision",
      "Momentum control",
    ],
    position: { x: 1420, y: 600 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick", "spins"],
    category: "kick-spins-category",
  },
];

const ShuffleSkillTree: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [selectedMove, setSelectedMove] = useState<ShuffleMove | null>(null);
  const [completedMoves, setCompletedMoves] = useState<Set<string>>(new Set());
  const [goals, setGoals] = useState<Set<string>>(new Set());
  const [completedSubComponents, setCompletedSubComponents] = useState<{
    [key: string]: Set<string>;
  }>({});
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [styleFilter, setStyleFilter] = useState<
    "all" | "melbourne" | "shapes"
  >("all");
  const [tagFilter, setTagFilter] = useState<
    "all" | "kick" | "spins" | "slides"
  >("all");
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const progress = userData.progress || {};
          const goalsData = userData.goals || {};
          const subProgress = userData.subComponentProgress || {};
          setCompletedMoves(
            new Set(Object.keys(progress).filter((key) => progress[key]))
          );
          setGoals(
            new Set(Object.keys(goalsData).filter((key) => goalsData[key]))
          );

          const loadedSubComponents: { [key: string]: Set<string> } = {};
          Object.keys(subProgress).forEach((moveId) => {
            loadedSubComponents[moveId] = new Set(
              Object.keys(subProgress[moveId]).filter(
                (key) => subProgress[moveId][key]
              )
            );
          });
          setCompletedSubComponents(loadedSubComponents);
        }
      }
      setLoading(false);
    };

    loadProgress();
  }, [currentUser]);

  const getDifficultyColor = (difficulty: string) => {
    const isDark = theme.palette.mode === "dark";
    switch (difficulty) {
      case "beginner":
        return isDark ? "#4caf50" : theme.palette.success.main;
      case "intermediate":
        return isDark ? "#ff9800" : theme.palette.warning.main;
      case "advanced":
        return isDark ? "#f44336" : theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const isUnlocked = (move: ShuffleMove) => {
    return move.prerequisites.every((prereq) => completedMoves.has(prereq));
  };

  const isCategoryUnlocked = (category: Category) => {
    return category.prerequisites.every((prereq) => completedMoves.has(prereq));
  };

  const canCompleteMove = (move: ShuffleMove) => {
    if (!move.subComponents) return true;
    const moveSubComponents = completedSubComponents[move.id] || new Set();
    return move.subComponents.every((sub) => moveSubComponents.has(sub.id));
  };

  const saveProgress = async (
    newCompleted: Set<string>,
    newSubComponents?: { [key: string]: Set<string> },
    newGoals?: Set<string>
  ) => {
    if (currentUser) {
      try {
        const progressObj: { [key: string]: boolean } = {};
        shuffleMoves.forEach((move) => {
          progressObj[move.id] = newCompleted.has(move.id);
        });

        const saveData: any = { progress: progressObj };

        if (newGoals) {
          const goalsObj: { [key: string]: boolean } = {};
          shuffleMoves.forEach((move) => {
            goalsObj[move.id] = newGoals.has(move.id);
          });
          saveData.goals = goalsObj;
        }

        if (newSubComponents) {
          const subProgressObj: { [key: string]: { [key: string]: boolean } } =
            {};
          Object.keys(newSubComponents).forEach((moveId) => {
            subProgressObj[moveId] = {};
            const move = shuffleMoves.find((m) => m.id === moveId);
            if (move?.subComponents) {
              move.subComponents.forEach((sub) => {
                subProgressObj[moveId][sub.id] = newSubComponents[moveId].has(
                  sub.id
                );
              });
            }
          });
          saveData.subComponentProgress = subProgressObj;
        }

        await setDoc(doc(db, "users", currentUser.uid), saveData, {
          merge: true,
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  const toggleSubComponent = async (moveId: string, subComponentId: string) => {
    const newSubComponents = { ...completedSubComponents };
    if (!newSubComponents[moveId]) {
      newSubComponents[moveId] = new Set();
    }

    if (newSubComponents[moveId].has(subComponentId)) {
      newSubComponents[moveId].delete(subComponentId);
    } else {
      newSubComponents[moveId].add(subComponentId);
    }

    setCompletedSubComponents(newSubComponents);

    // Only save to Firebase if user is logged in
    if (currentUser) {
      await saveProgress(completedMoves, newSubComponents, goals);
    }
  };

  const toggleGoal = async (moveId: string) => {
    const newGoals = new Set(goals);
    if (newGoals.has(moveId)) {
      newGoals.delete(moveId);
    } else {
      newGoals.add(moveId);
    }
    setGoals(newGoals);

    // Only save to Firebase if user is logged in
    if (currentUser) {
      await saveProgress(completedMoves, completedSubComponents, newGoals);
    }
  };

  const toggleComplete = async (moveId: string) => {
    const move = shuffleMoves.find((m) => m.id === moveId);
    if (move?.subComponents && !canCompleteMove(move)) {
      return; // Cannot complete if sub-components are not all done
    }

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
      await saveProgress(newCompleted, completedSubComponents, goals);
    }
  };

  const getConnectionLines = () => {
    const lines: React.ReactElement[] = [];

    filteredMoves.forEach((move) => {
      move.unlocks.forEach((unlockedMoveId) => {
        const unlockedMove = shuffleMoves.find((m) => m.id === unlockedMoveId);
        // Only show lines if both moves are visible in the filtered moves
        if (
          unlockedMove &&
          filteredMoves.some((m) => m.id === unlockedMoveId)
        ) {
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

  const getFilteredMoves = () => {
    let filteredMoves = shuffleMoves;

    // Filter by style
    if (styleFilter !== "all") {
      filteredMoves = filteredMoves.filter((move) =>
        move.styles.includes(styleFilter)
      );
    }

    // Filter by tag
    if (tagFilter !== "all") {
      filteredMoves = filteredMoves.filter(
        (move) => move.tags && move.tags.includes(tagFilter)
      );
    }

    return filteredMoves;
  };

  const filteredMoves = getFilteredMoves();

  if (loading) {
    return <Box>Loading progress...</Box>;
  }

  return (
    <Box>
      {/* Full Screen Toggle */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsFullScreen(!isFullScreen)}
          startIcon={isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          size="small"
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </Button>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ mb: 3 }}>
        {/* Style Filter */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Style:
          </Typography>
          <Chip
            label="All"
            variant={styleFilter === "all" ? "filled" : "outlined"}
            onClick={() => setStyleFilter("all")}
            color={styleFilter === "all" ? "primary" : "default"}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Melbourne"
            variant={styleFilter === "melbourne" ? "filled" : "outlined"}
            onClick={() => setStyleFilter("melbourne")}
            color={styleFilter === "melbourne" ? "primary" : "default"}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Shapes"
            variant={styleFilter === "shapes" ? "filled" : "outlined"}
            onClick={() => setStyleFilter("shapes")}
            color={styleFilter === "shapes" ? "primary" : "default"}
            sx={{ cursor: "pointer" }}
          />
        </Box>

        {/* Tag Filter */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Tags:
          </Typography>
          <Chip
            label="All"
            variant={tagFilter === "all" ? "filled" : "outlined"}
            onClick={() => setTagFilter("all")}
            color={tagFilter === "all" ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="🦵 Kicks"
            variant={tagFilter === "kick" ? "filled" : "outlined"}
            onClick={() => setTagFilter("kick")}
            color={tagFilter === "kick" ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="🌀 Spins"
            variant={tagFilter === "spins" ? "filled" : "outlined"}
            onClick={() => setTagFilter("spins")}
            color={tagFilter === "spins" ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="🛝 Slides"
            variant={tagFilter === "slides" ? "filled" : "outlined"}
            onClick={() => setTagFilter("slides")}
            color={tagFilter === "slides" ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
          />
        </Box>
      </Box>

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
          position: isFullScreen ? "fixed" : "relative",
          top: isFullScreen ? 0 : "auto",
          left: isFullScreen ? 0 : "auto",
          width: isFullScreen ? "100vw" : "100%",
          height: isFullScreen ? "100vh" : "800px",
          overflow: "auto",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: isFullScreen ? 0 : 2,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          zIndex: isFullScreen ? 9999 : "auto",
        }}
      >
        {/* Full Screen Exit Button (shown only in full screen) */}
        {isFullScreen && (
          <Button
            variant="contained"
            onClick={() => setIsFullScreen(false)}
            startIcon={<FullscreenExit />}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
            }}
          >
            Exit Full Screen
          </Button>
        )}

        <svg
          width="2000"
          height="800"
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
            y="380"
            width="25"
            height="90"
            fill={getDifficultyColor("intermediate")}
            opacity="0.8"
            rx="4"
          />
          <text
            x="17"
            y="425"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90 17 425)"
          >
            Intermediate
          </text>

          <rect
            x="5"
            y="600"
            width="25"
            height="70"
            fill={getDifficultyColor("advanced")}
            opacity="0.8"
            rx="4"
          />
          <text
            x="17"
            y="635"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform="rotate(-90 17 635)"
          >
            Advanced
          </text>

          {/* Optional: Add horizontal guide lines */}
          <line
            x1="0"
            y1="170"
            x2="2000"
            y2="170"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="0"
            y1="330"
            x2="2000"
            y2="330"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="0"
            y1="540"
            x2="2000"
            y2="540"
            stroke={theme.palette.divider}
            strokeWidth="1"
            opacity="0.3"
          />

          {getConnectionLines()}
        </svg>

        {/* Category Headers */}
        {categories.map((category) => {
          const categoryUnlocked = isCategoryUnlocked(category);
          const categoryMoves = filteredMoves.filter(
            (move) => move.category === category.id
          );

          // Only show category if it has moves in the current filter
          if (categoryMoves.length === 0) return null;

          // Calculate center position based on moves in this category
          const movePositions = categoryMoves.map((move) => move.position.x);
          const minX = Math.min(...movePositions);
          const maxX = Math.max(...movePositions);
          const centerX = (minX + maxX) / 2 + 75; // +75 for center of card width

          return (
            <Box
              key={category.id}
              sx={{
                position: "absolute",
                left: centerX - 50, // Center the header (assuming ~100px header width)
                top: category.position.y - 15,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Chip
                label={`${category.name} ${!categoryUnlocked ? "🔒" : ""}`}
                size="small"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  color: categoryUnlocked
                    ? theme.palette.primary.main
                    : theme.palette.grey[600],
                  backgroundColor: theme.palette.background.paper,
                  border: `2px solid ${
                    categoryUnlocked
                      ? theme.palette.primary.main
                      : theme.palette.grey[400]
                  }`,
                  opacity: categoryUnlocked ? 1 : 0.5,
                }}
              />
            </Box>
          );
        })}

        {filteredMoves.map((move) => {
          const isCompleted = completedMoves.has(move.id);
          const isLocked = !isUnlocked(move);

          // If move is in a category, check if category is unlocked
          if (move.category) {
            const category = categories.find((cat) => cat.id === move.category);
            if (category && !isCategoryUnlocked(category)) {
              return null; // Don't render move if category is locked
            }
          }

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
                  : `1px solid ${theme.palette.divider}`,
                opacity: isLocked && !isCompleted ? 0.5 : 1,
                backgroundColor: isCompleted
                  ? theme.palette.primary.light +
                    (theme.palette.mode === "dark" ? "40" : "")
                  : theme.palette.background.paper,
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: theme.shadows[8],
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedMove(move)}
            >
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                {/* Header with difficulty color border */}
                <Box
                  sx={{
                    borderTop: `4px solid ${getDifficultyColor(
                      move.difficulty
                    )}`,
                    p: 1.5,
                    pb: 1,
                  }}
                >
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
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                      {goals.has(move.id) && (
                        <Flag color="warning" fontSize="small" />
                      )}
                      {isCompleted ? (
                        <CheckCircle color="primary" fontSize="small" />
                      ) : isLocked ? (
                        <Lock color="disabled" fontSize="small" />
                      ) : (
                        <PlayArrow color="action" fontSize="small" />
                      )}
                    </Box>
                  </Box>

                  {/* Tags only */}
                  {move.tags && move.tags.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {move.tags.map((tag) => (
                        <Chip
                          key={tag}
                          size="small"
                          label={
                            tag === "kick"
                              ? "🦵"
                              : tag === "spins"
                              ? "🌀"
                              : tag === "slides"
                              ? "🛝"
                              : tag
                          }
                          sx={{
                            fontSize: "0.6rem",
                            height: "18px",
                            backgroundColor: theme.palette.secondary.light,
                            color: "white",
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "text.secondary",
                      fontSize: "0.7rem",
                    }}
                  >
                    {move.description.substring(0, 35)}...
                  </Typography>
                </Box>
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
        sx={{
          zIndex: isFullScreen ? 10000 : 1300,
        }}
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
                          onClick={() =>
                            prereqMove && setSelectedMove(prereqMove)
                          }
                          sx={{ cursor: "pointer" }}
                        />
                      );
                    })}
                  </Box>
                </>
              )}

              {selectedMove.subComponents &&
                selectedMove.subComponents.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Components to Master:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {selectedMove.subComponents.map((subComponent) => {
                        const moveSubComponents =
                          completedSubComponents[selectedMove.id] || new Set();
                        return (
                          <FormControlLabel
                            key={subComponent.id}
                            control={
                              <Checkbox
                                checked={moveSubComponents.has(subComponent.id)}
                                onChange={() =>
                                  toggleSubComponent(
                                    selectedMove.id,
                                    subComponent.id
                                  )
                                }
                                disabled={!isUnlocked(selectedMove)}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {subComponent.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {subComponent.description}
                                </Typography>
                              </Box>
                            }
                          />
                        );
                      })}
                    </Box>
                  </>
                )}

              {selectedMove.tags && selectedMove.tags.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Tags:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    {selectedMove.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`${
                          tag === "kick"
                            ? "🦵"
                            : tag === "spins"
                            ? "🌀"
                            : tag === "slides"
                            ? "🛝"
                            : ""
                        } ${tag.charAt(0).toUpperCase() + tag.slice(1)}`}
                        color="secondary"
                        size="small"
                      />
                    ))}
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
                          onClick={() =>
                            unlockMove && setSelectedMove(unlockMove)
                          }
                          sx={{ cursor: "pointer" }}
                        />
                      );
                    })}
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {currentUser && !completedMoves.has(selectedMove.id) && (
                <Button
                  onClick={() => toggleGoal(selectedMove.id)}
                  variant={goals.has(selectedMove.id) ? "contained" : "outlined"}
                  startIcon={goals.has(selectedMove.id) ? <Flag /> : <FlagOutlined />}
                  color="warning"
                >
                  {goals.has(selectedMove.id) ? "Remove Goal" : "Add Goal"}
                </Button>
              )}
              <Button
                onClick={() => toggleComplete(selectedMove.id)}
                variant={
                  completedMoves.has(selectedMove.id) ? "outlined" : "contained"
                }
                disabled={
                  !isUnlocked(selectedMove) ||
                  (selectedMove.subComponents && !canCompleteMove(selectedMove))
                }
              >
                {completedMoves.has(selectedMove.id)
                  ? "Mark Incomplete"
                  : selectedMove.subComponents && !canCompleteMove(selectedMove)
                  ? "Complete All Components First"
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
                    <Button size="small" onClick={() => setAuthModalOpen(true)}>
                      Login here
                    </Button>
                  </Typography>
                </Alert>
              </Box>
            )}
          </>
        )}
      </Dialog>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
    </Box>
  );
};

export default ShuffleSkillTree;
