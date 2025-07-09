import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Stack,
  AppBar,
  Toolbar,
  Button,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  School,
  TrendingUp,
  Star,
  Logout,
  Person,
  Login,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import ShuffleSkillTree from '../components/ShuffleSkillTree';

const SkillTreePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({
    beginner: { completed: 0, total: 5 },
    intermediate: { completed: 0, total: 3 },
    advanced: { completed: 0, total: 2 },
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const loadProgress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProgress = userData.progress || {};
          
          // Count completed moves by difficulty
          const beginnerMoves = ['running-man', 't-step', 'charleston', 'reverse-running-man', 'reverse-t-step'];
          const intermediateMoves = ['fast-heel-toe', 'running-man-variations', 't-step-variations'];
          const advancedMoves = ['spin-heel-toe', 'freestyle'];
          
          const beginnerCompleted = beginnerMoves.filter(move => userProgress[move]).length;
          const intermediateCompleted = intermediateMoves.filter(move => userProgress[move]).length;
          const advancedCompleted = advancedMoves.filter(move => userProgress[move]).length;
          
          setProgress({
            beginner: { completed: beginnerCompleted, total: beginnerMoves.length },
            intermediate: { completed: intermediateCompleted, total: intermediateMoves.length },
            advanced: { completed: advancedCompleted, total: advancedMoves.length },
          });
        }
      }
    };

    loadProgress();
  }, [currentUser]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" color="primary" sx={{ width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shuffle Skill Tree
          </Typography>
          {currentUser ? (
            <>
              <Button
                color="inherit"
                onClick={handleMenuOpen}
                startIcon={
                  <Avatar
                    src={currentUser?.photoURL || undefined}
                    sx={{ width: 24, height: 24 }}
                  >
                    {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                  </Avatar>
                }
              >
                {currentUser?.displayName || currentUser?.email || 'User'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              startIcon={<Login />}
            >
              Login to Save Progress
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <School sx={{ mr: 2, verticalAlign: 'middle' }} />
            Shuffle Learning Path
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Interactive skill tree showing the optimal progression for learning shuffle dance moves
          </Typography>
        </Box>

        {/* Instructions */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>How to use:</strong> Click on any move to see details and mark as completed. 
            Locked moves (🔒) require prerequisites to be completed first. Lines show the progression path between moves.
          </Typography>
        </Alert>

        {/* Statistics */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            {currentUser ? 'Your Learning Progress' : 'Learning Progress'}
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
                  {progress.intermediate.completed}/{progress.intermediate.total}
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
                <strong>Login to track your progress!</strong> You can explore all moves below, but your progress won't be saved unless you're logged in.
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Skill Tree */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                <strong>Start with foundations:</strong> Master Running Man, T-Step, and Heel-Toe before moving to intermediate moves
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Practice prerequisites:</strong> Each move builds on previous skills - don't skip steps
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Combine gradually:</strong> Once you master individual moves, practice smooth transitions
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Express yourself:</strong> Advanced moves focus on personal style and creativity
              </Typography>
            </li>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SkillTreePage;