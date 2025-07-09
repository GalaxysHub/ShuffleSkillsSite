import React from 'react';
import {
  Box,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import {
  DirectionsRun,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: 'grey.100',
        borderTop: 1,
        borderColor: 'divider',
        mt: 8,
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 1200, py: 4 }}>
          {/* Main Footer Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              mb: 3,
              gap: { xs: 3, md: 0 },
            }}
          >
            {/* Logo and Description */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsRun
                  sx={{
                    mr: 1,
                    fontSize: 28,
                    color: 'primary.main',
                    filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.2))',
                    transform: 'rotate(-10deg)',
                  }}
                />
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  Shuffle Skill Tree
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Interactive skill tree for tracking your shuffle dance progression.
                Master moves from beginner to advanced with visual learning paths.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="#" underline="hover" color="text.secondary">
                  Skill Tree
                </Link>
                <Link href="/login" underline="hover" color="text.secondary">
                  Login
                </Link>
                <Link href="/register" underline="hover" color="text.secondary">
                  Sign Up
                </Link>
              </Box>
            </Box>

            {/* Learning Resources */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Learning
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  • Start with basic moves
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Practice prerequisites
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Master combinations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Express your style
                </Typography>
              </Box>
            </Box>

          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Copyright */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Shuffle Skill Tree. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built for the shuffle dance community
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;