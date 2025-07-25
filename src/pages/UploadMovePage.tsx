import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { CloudUpload, Add, Delete, Send } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadMoveGif } from '../utils/storage';

interface MoveFormData {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  prerequisites: string[];
  unlocks: string[];
  description: string;
  keyPoints: string[];
  styles: string[];
  tags: string[];
  sourceUrl: string;
}

const difficultyOptions = ['beginner', 'intermediate', 'advanced'];
const styleOptions = ['melbourne', 'shapes', 'freestyle', 'hardstyle'];
const commonTags = ['slides', 'kicks', 'spins', 'footwork', 'transitions'];

// Common move names for autocomplete
const existingMoves = [
  'running-man', 't-step', 'reverse-running-man', 'charleston', 'polly-pocket',
  'bree-spins', 'sacco-kicks', 'front-hook-kick', 'back-hook-kick', 'v-step',
  'w-m-step', 'reverse-t-step', 't-step-variations', 'shaper-t-step'
];

export default function UploadMovePage() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<MoveFormData>({
    name: '',
    difficulty: '',
    prerequisites: [],
    unlocks: [],
    description: '',
    keyPoints: [''],
    styles: [],
    tags: [],
    sourceUrl: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ['image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a GIF or video file (MP4, MOV, AVI)');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setError('File size must be under 50MB. Please compress your video or choose a smaller file.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const addKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        keyPoints: [...prev.keyPoints.filter(kp => kp.trim()), newKeyPoint.trim()]
      }));
      setNewKeyPoint('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to submit moves');
      return;
    }

    // Validation
    if (!formData.name.trim() || !formData.difficulty || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!file) {
      setError('Please upload a GIF or video demonstrating the move');
      return;
    }

    if (formData.keyPoints.filter(kp => kp.trim()).length === 0) {
      setError('Please add at least one key point');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let videoUrl = '';
      let userIp = '';
      
      // Get user's IP address
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIp = ipData.ip;
      } catch (ipError) {
        console.warn('Could not fetch IP address:', ipError);
        // Continue without IP if service is unavailable
      }
      
      // Upload file (required)
      videoUrl = await uploadMoveGif(file, formData.name);

      // Save to Firestore
      const moveData = {
        ...formData,
        keyPoints: formData.keyPoints.filter(kp => kp.trim()),
        videoUrl,
        submittedBy: currentUser.uid,
        submitterEmail: currentUser.email,
        submitterName: currentUser.displayName || 'Anonymous',
        submitterIp: userIp,
        userAgent: navigator.userAgent,
        status: 'pending', // Admin review required
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0
      };

      await addDoc(collection(db, 'move-suggestions'), moveData);

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        difficulty: '',
        prerequisites: [],
        unlocks: [],
        description: '',
        keyPoints: [''],
        styles: [],
        tags: [],
        sourceUrl: ''
      });
      setFile(null);
    } catch (err) {
      console.error('Error submitting move:', err);
      setError('Failed to submit move. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: "100vh", width: "100vw", margin: 0, padding: 0 }}>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <Alert severity="warning">
            Please log in to submit moves to the community.
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", width: "100vw", margin: 0, padding: 0 }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
          Submit a New Move
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Share your shuffle moves with the community
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            Move submitted successfully! It will be reviewed before being added to the skill tree.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card elevation={3} sx={{ '&:hover': { transform: 'none', boxShadow: 3 } }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Basic Info */}
                <TextField
                  fullWidth
                  label="Move Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="e.g., T-Step, Running Man"
                />

                <FormControl fullWidth required disabled={loading}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleSelectChange}
                    label="Difficulty"
                  >
                    {difficultyOptions.map(option => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                  disabled={loading}
                  placeholder="Describe the move, its origins, and what makes it unique"
                />

                <TextField
                  fullWidth
                  label="Source URL (Optional)"
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="https://example.com/original-video or credit source"
                  helperText="Link to original video, tutorial, or source where this move was learned"
                />

                {/* Prerequisites */}
                <Autocomplete
                  multiple
                  options={existingMoves}
                  value={formData.prerequisites}
                  onChange={(_, newValue) => setFormData(prev => ({ ...prev, prerequisites: newValue }))}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <Chip key={key} variant="outlined" label={option} {...chipProps} />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Prerequisites"
                      placeholder="Select moves that should be learned first"
                    />
                  )}
                />

                {/* Unlocks */}
                <Autocomplete
                  multiple
                  options={existingMoves}
                  value={formData.unlocks}
                  onChange={(_, newValue) => setFormData(prev => ({ ...prev, unlocks: newValue }))}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <Chip key={key} variant="outlined" label={option} {...chipProps} />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unlocks"
                      placeholder="Select moves this enables"
                    />
                  )}
                />

                {/* Key Points */}
                <Box>
                  <Typography variant="h6" gutterBottom>Key Learning Points</Typography>
                  <Stack spacing={2}>
                    {formData.keyPoints.map((point, index) => (
                      point.trim() && (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={point}
                            onDelete={() => removeKeyPoint(index)}
                            deleteIcon={<Delete />}
                            variant="outlined"
                            sx={{ flex: 1, justifyContent: 'space-between' }}
                          />
                        </Box>
                      )
                    ))}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a key learning point"
                        value={newKeyPoint}
                        onChange={(e) => setNewKeyPoint(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
                        disabled={loading}
                      />
                      <Button
                        variant="outlined"
                        onClick={addKeyPoint}
                        startIcon={<Add />}
                        disabled={loading || !newKeyPoint.trim()}
                      >
                        Add
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                {/* Styles */}
                <Autocomplete
                  multiple
                  options={styleOptions}
                  value={formData.styles}
                  onChange={(_, newValue) => setFormData(prev => ({ ...prev, styles: newValue }))}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <Chip key={key} variant="outlined" label={option} {...chipProps} />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Styles"
                      placeholder="Select applicable dance styles"
                    />
                  )}
                />

                {/* Tags */}
                <Autocomplete
                  multiple
                  freeSolo
                  options={commonTags}
                  value={formData.tags}
                  onChange={(_, newValue) => setFormData(prev => ({ ...prev, tags: newValue }))}
                  disabled={loading}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <Chip key={key} variant="outlined" label={option} {...chipProps} />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add descriptive tags"
                    />
                  )}
                />

                {/* File Upload */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upload Video/GIF <Typography component="span" color="error">*</Typography>
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/gif,video/mp4,video/quicktime,video/x-msvideo"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  {file && (
                    <Typography variant="body2" color="text.secondary">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  )}
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? 'Submitting...' : 'Submit Move'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={1} sx={{ mt: 3, '&:hover': { transform: 'none', boxShadow: 1 } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Submission Guidelines</Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li><Typography variant="body2">Moves will be reviewed before being added to the skill tree</Typography></li>
              <li><Typography variant="body2">Provide clear, accurate descriptions and key learning points</Typography></li>
              <li><Typography variant="body2">GIF/video files must be under 50MB (smaller files recommended for faster loading)</Typography></li>
              <li><Typography variant="body2">Credit original creators or sources when applicable</Typography></li>
              <li><Typography variant="body2">Duplicate or inappropriate submissions may be rejected</Typography></li>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
}