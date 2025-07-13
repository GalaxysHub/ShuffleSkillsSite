import React, { useState, useEffect } from "react";
import {
  Box,
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
  Star,
  Timeline,
  Fullscreen,
  FullscreenExit,
  Flag,
  FlagOutlined,
} from "@mui/icons-material";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthModal from "./AuthModal";
import ShuffleMoveNode from "./ShuffleMoveNode";

// Define nodeTypes outside component to prevent React Flow warnings
const nodeTypes = { shuffleMove: ShuffleMoveNode };

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
      "Iconic hip-hop dance move from the late 1980s featuring in-place running motion that became a cornerstone of shuffle dance",
    keyPoints: [
      "Mimics running in place motion",
      "Keep weight on balls of feet", 
      "Maintain consistent rhythm",
      "Fundamental building block for shuffle dance"
    ],
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
      "v-step",
    ],
    description: "Core Melbourne shuffle move from the late 1980s featuring fast heel-toe footwork that creates the characteristic shuffle glide effect",
    keyPoints: [
      "Fast heel-and-toe movement with ankle twisting",
      "Creates T-shaped pattern with foot positioning", 
      "Lift foot, move to side, shift weight, bring feet together",
      "Foundation for the gliding illusion across floor",
      "Essential building block for advanced combinations"
    ],
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
      "Historic 1920s dance with African-American roots, adapted for shuffle with signature kick-and-step patterns and swinging arm movements",
    keyPoints: [
      "Originated from African Juba dance traditions",
      "Kick forward, walk back, kick back, walk forward",
      "High energy kicks with swinging arms",
      "Twist feet and maintain syncopated rhythm",
      "Foundation for modern swing dance elements"
    ],
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
  {
    id: "v-step",
    name: "V-Step",
    difficulty: "beginner",
    prerequisites: ["t-step"],
    unlocks: [],
    description: "V-shaped movement pattern with outward and inward foot positioning",
    keyPoints: [
      "V formation with feet",
      "Outward then inward motion",
      "Balance and control",
      "Smooth transitions",
    ],
    position: { x: 1250, y: 250 },
    completed: false,
    styles: ["melbourne", "shapes"],
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
    name: "180 Frontside Kickspin",
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
    unlocks: ["360-backside-kickspin"],
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
  {
    id: "360-backside-kickspin",
    name: "360 Backside Kickspin",
    difficulty: "advanced",
    prerequisites: ["180-backside-kickspin"],
    unlocks: [],
    description:
      "Full rotation backside kickspin requiring advanced balance, rotational control, and precise backside technique",
    keyPoints: [
      "Full 360 rotation",
      "Backside technique mastery",
      "Sustained balance throughout rotation",
      "Precise landing control",
      "Advanced momentum management",
    ],
    position: { x: 1580, y: 600 },
    completed: false,
    styles: ["melbourne"],
    tags: ["kick", "spins"],
    category: "kick-spins-category",
  },
];

const ShuffleSkillTreeComponent: React.FC = () => {
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
  const [styleFilters, setStyleFilters] = useState<Set<string>>(new Set());
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());
  const [levelFilters, setLevelFilters] = useState<Set<string>>(new Set());
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
      } else {
        // Load goals from localStorage for non-logged-in users
        const localGoals = localStorage.getItem('shuffleGoals');
        if (localGoals) {
          setGoals(new Set(JSON.parse(localGoals)));
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

    if (currentUser) {
      // Save to Firebase if user is logged in
      await saveProgress(completedMoves, completedSubComponents, newGoals);
    } else {
      // Save to localStorage if user is not logged in
      localStorage.setItem('shuffleGoals', JSON.stringify(Array.from(newGoals)));
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


  const getFilteredMoves = () => {
    let filteredMoves = shuffleMoves;

    // Filter by style
    if (styleFilters.size > 0) {
      filteredMoves = filteredMoves.filter((move) =>
        move.styles.some(style => styleFilters.has(style))
      );
    }

    // Filter by tag
    if (tagFilters.size > 0) {
      filteredMoves = filteredMoves.filter(
        (move) => move.tags && move.tags.some(tag => tagFilters.has(tag))
      );
    }

    // Filter by level
    if (levelFilters.size > 0) {
      filteredMoves = filteredMoves.filter(
        (move) => levelFilters.has(move.difficulty)
      );
    }

    return filteredMoves;
  };

  

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when data changes
  useEffect(() => {
    const filteredMoves = getFilteredMoves();
    
    const newNodes: Node[] = filteredMoves.map((move) => ({
      id: move.id,
      type: 'shuffleMove',
      position: { x: move.position.x, y: move.position.y },
      data: {
        id: move.id,
        name: move.name,
        difficulty: move.difficulty,
        description: move.description,
        tags: move.tags,
        isCompleted: completedMoves.has(move.id),
        isLocked: !isUnlocked(move),
        isGoal: goals.has(move.id),
        onClick: () => setSelectedMove(move),
      },
    }));
    
    const newEdges: Edge[] = [];
    filteredMoves.forEach((move) => {
      move.unlocks.forEach((unlockedMoveId) => {
        if (filteredMoves.some((m) => m.id === unlockedMoveId)) {
          newEdges.push({
            id: `${move.id}-${unlockedMoveId}`,
            source: move.id,
            target: unlockedMoveId,
            type: 'smoothstep',
            style: {
              stroke: completedMoves.has(move.id)
                ? theme.palette.primary.main
                : theme.palette.grey[300],
              strokeWidth: completedMoves.has(move.id) ? 3 : 2,
              strokeDasharray: completedMoves.has(move.id) ? '0' : '5,5',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: completedMoves.has(move.id)
                ? theme.palette.primary.main
                : theme.palette.grey[300],
            },
          });
        }
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [styleFilters, tagFilters, levelFilters, completedMoves, goals, theme]);

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
          <Typography variant="h6" sx={{ mr: 1, fontFamily: '"Orbitron", sans-serif' }}>
            STYLE:
          </Typography>
          <Chip
            label="ALL"
            variant={styleFilters.size === 0 || styleFilters.size === 2 ? "filled" : "outlined"}
            onClick={() => {
              if (styleFilters.size === 0 || styleFilters.size === 2) {
                setStyleFilters(new Set());
              } else {
                setStyleFilters(new Set(["melbourne", "shapes"]));
              }
            }}
            color={styleFilters.size === 0 || styleFilters.size === 2 ? "primary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(0, 255, 255, 0.5)'
                  : '0 0 10px rgba(26, 35, 126, 0.3)',
              }
            }}
          />
          <Chip
            label="MELBOURNE"
            variant={styleFilters.has("melbourne") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(styleFilters);
              if (newFilters.has("melbourne")) {
                newFilters.delete("melbourne");
              } else {
                newFilters.add("melbourne");
              }
              setStyleFilters(newFilters);
            }}
            color={styleFilters.has("melbourne") ? "primary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(0, 255, 255, 0.5)'
                  : '0 0 10px rgba(26, 35, 126, 0.3)',
              }
            }}
          />
          <Chip
            label="SHAPES"
            variant={styleFilters.has("shapes") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(styleFilters);
              if (newFilters.has("shapes")) {
                newFilters.delete("shapes");
              } else {
                newFilters.add("shapes");
              }
              setStyleFilters(newFilters);
            }}
            color={styleFilters.has("shapes") ? "primary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(0, 255, 255, 0.5)'
                  : '0 0 10px rgba(26, 35, 126, 0.3)',
              }
            }}
          />
        </Box>

        {/* Move Filter */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 1, fontFamily: '"Orbitron", sans-serif' }}>
            MOVES:
          </Typography>
          <Chip
            label="ALL"
            variant={tagFilters.size === 0 || tagFilters.size === 3 ? "filled" : "outlined"}
            onClick={() => {
              if (tagFilters.size === 0 || tagFilters.size === 3) {
                setTagFilters(new Set());
              } else {
                setTagFilters(new Set(["kick", "spins", "slides"]));
              }
            }}
            color={tagFilters.size === 0 || tagFilters.size === 3 ? "secondary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(255, 0, 153, 0.5)'
                  : '0 0 10px rgba(233, 30, 99, 0.3)',
              }
            }}
          />
          <Chip
            label="⚡ KICKS"
            variant={tagFilters.has("kick") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(tagFilters);
              if (newFilters.has("kick")) {
                newFilters.delete("kick");
              } else {
                newFilters.add("kick");
              }
              setTagFilters(newFilters);
            }}
            color={tagFilters.has("kick") ? "secondary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(255, 0, 153, 0.5)'
                  : '0 0 10px rgba(233, 30, 99, 0.3)',
              }
            }}
          />
          <Chip
            label="🌀 SPINS"
            variant={tagFilters.has("spins") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(tagFilters);
              if (newFilters.has("spins")) {
                newFilters.delete("spins");
              } else {
                newFilters.add("spins");
              }
              setTagFilters(newFilters);
            }}
            color={tagFilters.has("spins") ? "secondary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(255, 0, 153, 0.5)'
                  : '0 0 10px rgba(233, 30, 99, 0.3)',
              }
            }}
          />
          <Chip
            label="⚡ SLIDES"
            variant={tagFilters.has("slides") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(tagFilters);
              if (newFilters.has("slides")) {
                newFilters.delete("slides");
              } else {
                newFilters.add("slides");
              }
              setTagFilters(newFilters);
            }}
            color={tagFilters.has("slides") ? "secondary" : "default"}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(255, 0, 153, 0.5)'
                  : '0 0 10px rgba(233, 30, 99, 0.3)',
              }
            }}
          />
        </Box>

        {/* Level Filter */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ mr: 1, fontFamily: '"Orbitron", sans-serif' }}>
            LEVEL:
          </Typography>
          <Chip
            label="ALL"
            variant={levelFilters.size === 0 || levelFilters.size === 3 ? "filled" : "outlined"}
            onClick={() => {
              if (levelFilters.size === 0 || levelFilters.size === 3) {
                setLevelFilters(new Set());
              } else {
                setLevelFilters(new Set(["beginner", "intermediate", "advanced"]));
              }
            }}
            sx={{ 
              cursor: "pointer",
              fontWeight: 'bold',
              backgroundColor: levelFilters.size === 0 || levelFilters.size === 3 ? theme.palette.text.primary : 'transparent',
              color: levelFilters.size === 0 || levelFilters.size === 3 ? theme.palette.background.paper : theme.palette.text.primary,
              border: `1px solid ${theme.palette.text.primary}`,
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 10px rgba(255, 255, 255, 0.5)'
                  : '0 0 10px rgba(0, 0, 0, 0.3)',
              }
            }}
          />
          <Chip
            icon={<Star />}
            label="BEGINNER"
            variant={levelFilters.has("beginner") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(levelFilters);
              if (newFilters.has("beginner")) {
                newFilters.delete("beginner");
              } else {
                newFilters.add("beginner");
              }
              setLevelFilters(newFilters);
            }}
            sx={{
              cursor: "pointer",
              fontWeight: 'bold',
              backgroundColor: levelFilters.has("beginner") ? getDifficultyColor("beginner") : 'transparent',
              color: levelFilters.has("beginner") ? "white" : getDifficultyColor("beginner"),
              border: `1px solid ${getDifficultyColor("beginner")}`,
              textShadow: levelFilters.has("beginner") ? '0 0 5px rgba(0,0,0,0.5)' : 'none',
              boxShadow: levelFilters.has("beginner") 
                ? (theme.palette.mode === 'dark' 
                    ? '0 0 15px rgba(57, 255, 20, 0.3)'
                    : '0 4px 8px rgba(46, 125, 50, 0.3)')
                : 'none',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 15px rgba(57, 255, 20, 0.5)'
                  : '0 0 10px rgba(46, 125, 50, 0.3)',
              }
            }}
          />
          <Chip
            icon={<Timeline />}
            label="INTERMEDIATE"
            variant={levelFilters.has("intermediate") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(levelFilters);
              if (newFilters.has("intermediate")) {
                newFilters.delete("intermediate");
              } else {
                newFilters.add("intermediate");
              }
              setLevelFilters(newFilters);
            }}
            sx={{
              cursor: "pointer",
              fontWeight: 'bold',
              backgroundColor: levelFilters.has("intermediate") ? getDifficultyColor("intermediate") : 'transparent',
              color: levelFilters.has("intermediate") ? "white" : getDifficultyColor("intermediate"),
              border: `1px solid ${getDifficultyColor("intermediate")}`,
              textShadow: levelFilters.has("intermediate") ? '0 0 5px rgba(0,0,0,0.5)' : 'none',
              boxShadow: levelFilters.has("intermediate") 
                ? (theme.palette.mode === 'dark' 
                    ? '0 0 15px rgba(255, 255, 0, 0.3)'
                    : '0 4px 8px rgba(245, 124, 0, 0.3)')
                : 'none',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 15px rgba(255, 255, 0, 0.5)'
                  : '0 0 10px rgba(245, 124, 0, 0.3)',
              }
            }}
          />
          <Chip
            icon={<CheckCircle />}
            label="ADVANCED"
            variant={levelFilters.has("advanced") ? "filled" : "outlined"}
            onClick={() => {
              const newFilters = new Set(levelFilters);
              if (newFilters.has("advanced")) {
                newFilters.delete("advanced");
              } else {
                newFilters.add("advanced");
              }
              setLevelFilters(newFilters);
            }}
            sx={{
              cursor: "pointer",
              fontWeight: 'bold',
              backgroundColor: levelFilters.has("advanced") ? getDifficultyColor("advanced") : 'transparent',
              color: levelFilters.has("advanced") ? "white" : getDifficultyColor("advanced"),
              border: `1px solid ${getDifficultyColor("advanced")}`,
              textShadow: levelFilters.has("advanced") ? '0 0 5px rgba(0,0,0,0.5)' : 'none',
              boxShadow: levelFilters.has("advanced") 
                ? (theme.palette.mode === 'dark' 
                    ? '0 0 15px rgba(255, 7, 58, 0.3)'
                    : '0 4px 8px rgba(211, 47, 47, 0.3)')
                : 'none',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 15px rgba(255, 7, 58, 0.5)'
                  : '0 0 10px rgba(211, 47, 47, 0.3)',
              }
            }}
          />
        </Box>
      </Box>


      {/* Goals Section */}
      {goals.size > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
            <Flag sx={{ mr: 1, verticalAlign: 'middle' }} />
            YOUR GOALS
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Array.from(goals).map((goalId) => {
              const move = shuffleMoves.find(m => m.id === goalId);
              return (
                <Chip
                  key={goalId}
                  label={move?.name || goalId}
                  color="warning"
                  variant="outlined"
                  icon={<Flag />}
                  size="small"
                  onClick={() => {
                    const goalMove = shuffleMoves.find(m => m.id === goalId);
                    if (goalMove) setSelectedMove(goalMove);
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              );
            })}
          </Box>
          {!currentUser && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Login to save your goals permanently
            </Typography>
          )}
        </Box>
      )}

      {/* Skill Tree Visualization */}
      <Box
        sx={{
          position: isFullScreen ? "fixed" : "relative",
          top: isFullScreen ? 0 : "auto",
          left: isFullScreen ? 0 : "auto",
          width: isFullScreen ? "100vw" : "100%",
          height: isFullScreen ? "100vh" : "800px",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: isFullScreen ? 0 : 2,
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

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
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
              {/* Move description/info and GIF container */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {/* Left side - Description and Key Points */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedMove.description}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Key Learning Points:
                  </Typography>
                  <Box component="ul" sx={{ mb: 0, pl: 2 }}>
                    {selectedMove.keyPoints.map((point, index) => (
                      <li key={index}>
                        <Typography variant="body2">{point}</Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
                
                {/* Right side - GIF placeholder */}
                <Box
                  sx={{
                    width: 320,
                    height: 240,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img 
                    src="https://media.tenor.com/BMya17p9R6kAAAAM/merry.gif"
                    alt="Shuffle dance demo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
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
              {!completedMoves.has(selectedMove.id) && (
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
              </Button>
              <Button onClick={() => setSelectedMove(null)}>Close</Button>
            </DialogActions>
            {!currentUser && (
              <Box sx={{ p: 2, pt: 0 }}>
                <Alert severity="info">
                  <Typography variant="body2">
                    Progress is saved locally. Login to sync across devices.
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

const ShuffleSkillTree: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ShuffleSkillTreeComponent />
    </ReactFlowProvider>
  );
};

export default ShuffleSkillTree;
