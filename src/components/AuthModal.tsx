import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Google, DirectionsRun, Close } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      if (mode === 'login') {
        await login(email, password);
        onClose();
        resetForm();
      } else if (mode === 'register') {
        await register(email, password, displayName);
        onClose();
        resetForm();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Check your inbox.');
        setEmail('');
      }
    } catch (err: any) {
      let errorMessage = '';
      switch (mode) {
        case 'login':
          errorMessage = 'Failed to log in';
          break;
        case 'register':
          errorMessage = 'Failed to create account';
          break;
        case 'reset':
          errorMessage = 'Failed to send reset email';
          break;
      }
      setError(err.message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'reset') => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          
          <Card sx={{ boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <DirectionsRun 
                  sx={{ 
                    mr: 2, 
                    fontSize: 40,
                    color: 'primary.main',
                    filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.2))',
                    transform: 'rotate(-10deg)'
                  }} 
                />
                <Typography component="h1" variant="h4" align="center">
                  {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
                </Typography>
              </Box>
              <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                {mode === 'login' ? 'Sign in to track your progress' : 
                 mode === 'register' ? 'Join the shuffle community' : 
                 'Enter your email to reset your password'}
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {mode === 'register' && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="displayName"
                    label="Display Name"
                    name="displayName"
                    autoComplete="name"
                    autoFocus={mode === 'register'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus={mode === 'login'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {mode !== 'reset' && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {mode === 'register' && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 
                    (mode === 'login' ? 'Signing In...' : mode === 'register' ? 'Creating Account...' : 'Sending Reset Email...') : 
                    (mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : 'Reset Password')
                  }
                </Button>
                
                {mode !== 'reset' && (
                  <>
                    <Divider sx={{ my: 2 }}>or</Divider>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      sx={{ mb: 2 }}
                    >
                      Continue with Google
                    </Button>
                  </>
                )}
                
                <Box textAlign="center">
                  {mode === 'reset' ? (
                    <Typography variant="body2">
                      Remember your password?{' '}
                      <Button 
                        variant="text" 
                        onClick={() => switchMode('login')}
                        sx={{ textTransform: 'none' }}
                      >
                        Sign in
                      </Button>
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Button 
                          variant="text" 
                          onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                          sx={{ textTransform: 'none' }}
                        >
                          {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </Button>
                      </Typography>
                      {mode === 'login' && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <Button 
                            variant="text" 
                            onClick={() => switchMode('reset')}
                            sx={{ textTransform: 'none' }}
                          >
                            Forgot password?
                          </Button>
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;