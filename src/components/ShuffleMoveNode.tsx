import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  useTheme,
} from "@mui/material";
import { CheckCircle, Lock, PlayArrow, Flag, DirectionsRun, Sports, RotateRight, SportsGymnastics, SportsHandball, Skateboarding, CatchingPokemon, Timeline, ThreeP, Transform, TrendingUp, TrendingDown, DirectionsWalk } from "@mui/icons-material";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

interface ShuffleMoveNodeData {
  id: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  tags?: ("kick" | "spins" | "slides")[];
  isCompleted: boolean;
  isLocked: boolean;
  isGoal: boolean;
  onClick: () => void;
}

const ShuffleMoveNode: React.FC<NodeProps<ShuffleMoveNodeData>> = ({
  data,
}) => {
  const theme = useTheme();

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

  const getMoveIcon = (moveName: string, tags?: string[]) => {
    const lowerName = moveName.toLowerCase();
    
    // Running-based moves
    if (lowerName.includes('running')) {
      return <DirectionsRun color="action" fontSize="small" />;
    }
    
    // T-Step and variations
    if (lowerName.includes('t-step') || lowerName.includes('t-step')) {
      return <Transform color="action" fontSize="small" />;
    }
    
    // Charleston
    if (lowerName.includes('charleston')) {
      return <SportsHandball color="action" fontSize="small" />;
    }
    
    // Spinning moves
    if (lowerName.includes('spin') || lowerName.includes('bree')) {
      return <RotateRight color="action" fontSize="small" />;
    }
    
    // Kick moves
    if (lowerName.includes('kick') || lowerName.includes('sacco')) {
      return <SportsGymnastics color="action" fontSize="small" />;
    }
    
    // Gliding/sliding moves
    if (lowerName.includes('glide') || lowerName.includes('moonwalk')) {
      return <DirectionsWalk color="action" fontSize="small" />;
    }
    
    // V-Step and W/M Step
    if (lowerName.includes('v-step') || lowerName.includes('w/m')) {
      return <Timeline color="action" fontSize="small" />;
    }
    
    // Cowtail
    if (lowerName.includes('cowtail')) {
      return <CatchingPokemon color="action" fontSize="small" />;
    }
    
    // Polly Pocket
    if (lowerName.includes('polly') || lowerName.includes('x-step')) {
      return <ThreeP color="action" fontSize="small" />;
    }
    
    // Circle moves
    if (lowerName.includes('circle')) {
      return <Sports color="action" fontSize="small" />;
    }
    
    // Side moves
    if (lowerName.includes('side') && !lowerName.includes('kick')) {
      return <TrendingUp color="action" fontSize="small" />;
    }
    
    // Default based on tags
    if (tags && tags.length > 0) {
      if (tags.includes('kick')) {
        return <SportsGymnastics color="action" fontSize="small" />;
      }
      if (tags.includes('spins')) {
        return <RotateRight color="action" fontSize="small" />;
      }
      if (tags.includes('slides')) {
        return <DirectionsWalk color="action" fontSize="small" />;
      }
    }
    
    // Default fallback
    return <DirectionsRun color="action" fontSize="small" />;
  };

  return (
    <>
      {/* Input handles for prerequisites */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: theme.palette.primary.main,
          width: 8,
          height: 8,
        }}
      />

      <Card
        sx={{
          width: 150,
          height: 120,
          cursor: "pointer",
          border: data.isCompleted
            ? `3px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
          opacity: data.isLocked && !data.isCompleted ? 0.5 : 1,
          backgroundColor: data.isCompleted
            ? theme.palette.mode === "dark"
              ? "rgba(0, 255, 255, 0.1)"
              : "rgba(26, 35, 126, 0.1)"
            : theme.palette.mode === "dark"
            ? "rgba(26, 26, 26, 0.9)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: data.isCompleted
            ? theme.palette.mode === "dark"
              ? "0 0 20px rgba(0, 255, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3)"
              : "0 0 20px rgba(26, 35, 126, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1)"
            : theme.palette.mode === "dark"
            ? "0 4px 15px rgba(0, 0, 0, 0.5)"
            : "0 4px 15px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            transform: "scale(1.05) translateY(-2px)",
            boxShadow: data.isCompleted
              ? theme.palette.mode === "dark"
                ? "0 0 30px rgba(0, 255, 255, 0.5), 0 8px 25px rgba(0, 0, 0, 0.4)"
                : "0 0 30px rgba(26, 35, 126, 0.3), 0 8px 25px rgba(0, 0, 0, 0.15)"
              : theme.palette.mode === "dark"
              ? "0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 0, 153, 0.2)"
              : "0 8px 25px rgba(0, 0, 0, 0.15), 0 0 15px rgba(233, 30, 99, 0.2)",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={data.onClick}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {/* Header with difficulty color border */}
          <Box
            sx={{
              borderTop: `4px solid ${getDifficultyColor(data.difficulty)}`,
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
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  fontFamily: '"Rajdhani", sans-serif',
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {data.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {data.isGoal && <Flag color="warning" fontSize="small" />}
                {data.isCompleted ? (
                  <CheckCircle color="primary" fontSize="small" />
                ) : data.isLocked ? (
                  <Lock color="disabled" fontSize="small" />
                ) : (
                  getMoveIcon(data.name, data.tags)
                )}
              </Box>
            </Box>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                {data.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={
                      tag === "kick"
                        ? "⚡"
                        : tag === "spins"
                        ? "🌀"
                        : tag === "slides"
                        ? "⚡"
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
              {data.description.substring(0, 35)}...
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Output handles for unlocks */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: theme.palette.primary.main,
          width: 8,
          height: 8,
        }}
      />
    </>
  );
};

export default ShuffleMoveNode;
