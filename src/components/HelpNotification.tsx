import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Help,
  Close,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const HelpNotification: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!open) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="info" 
        icon={<Help />}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ mr: 1 }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>Community Help Appreciated!</AlertTitle>
        Any help on the site is appreciated including adding new moves, organization recommendations, and editing card info.
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <strong>How you can help:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li><strong>Add new moves:</strong> Use the "Upload Move" feature to submit shuffle moves with videos and detailed descriptions</li>
              <li><strong>Organization recommendations:</strong> Contact us with suggestions for better categorization or skill tree layout</li>
              <li><strong>Edit card info:</strong> Help us improve move descriptions, key points, or correct any errors you find</li>
              <li><strong>Share feedback:</strong> Let us know what features would help you learn better</li>
            </ul>
          </Box>
        </Collapse>
      </Alert>
    </Box>
  );
};

export default HelpNotification;