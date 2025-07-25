import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  Link,
} from "@mui/material";
import { 
  People, 
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const ContributionsPage: React.FC = () => {
  const theme = useTheme();


  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
    }}>
      <Navbar />
      
      <Box sx={{ 
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
      }}>
        <Box sx={{ width: '100%', maxWidth: 1400, py: 4 }}>
        {/* Header */}
        <Stack spacing={3} alignItems="center" sx={{ mb: 6 }}>
          <People 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            }} 
          />
          <Typography 
            variant="h2" 
            component="h1" 
            align="center"
            sx={{
              fontWeight: 'bold',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #00ffff, #ff0099)'
                : 'linear-gradient(45deg, #1a237e, #e91e63)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: theme.palette.mode === 'dark' 
                ? '2px 2px 4px rgba(0,0,0,0.5)'
                : '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Contributors
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            Thank you to everyone who has helped make the Shuffle Skill Tree possible. 
            Your contributions, feedback, and support drive this project forward.
          </Typography>
        </Stack>

        {/* Contributors Section */}
        <Stack spacing={4} sx={{ mb: 6 }}>
          {/* Joe Callingbull */}
          <Card sx={{ '&:hover': { transform: 'none', boxShadow: 3 } }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Joe Callingbull
              </Typography>
              <Typography variant="body1" paragraph>
                Special thanks to Joe Callingbull for being willing to share his collection of videos.
              </Typography>
              <Typography variant="body1">
                Check out his YouTube channel: {' '}
                <Link 
                  href="https://www.youtube.com/@Shootnstar60"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.dark',
                    }
                  }}
                >
                  @Shootnstar60
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Call to Action */}
        <Card sx={{ mt: 6, textAlign: 'center' }}>
          <CardContent sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Want to Contribute?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We welcome contributions from the shuffle dance community! Whether it's submitting new moves, 
              reporting bugs, providing feedback, or helping with development.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Typography variant="body2" color="text.secondary">
                Reach out through our contact page or submit issues and suggestions.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ContributionsPage;