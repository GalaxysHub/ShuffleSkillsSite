import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { 
  People,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CommunityGuidelinesPage: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontFamily: '"Orbitron", sans-serif' }}
          >
            <People
              sx={{ mr: 2, verticalAlign: "middle", fontSize: "inherit" }}
            />
            Community Guidelines
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Building a positive and supportive shuffle dance community
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
              Our Community Standards
            </Typography>
            
            <Typography variant="body1" paragraph>
              The Shuffle Skill Tree community is built on mutual respect, learning, and the shared passion for shuffle dance.
              These guidelines help us maintain a welcoming environment for dancers of all skill levels.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                General Conduct
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be respectful:</strong> Treat all community members with kindness and respect, regardless of their skill level or dance style preference
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be supportive:</strong> Encourage fellow dancers and provide constructive feedback when appropriate
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be inclusive:</strong> Welcome newcomers and help create an environment where everyone feels comfortable learning
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Stay positive:</strong> Focus on growth, improvement, and celebrating achievements within our community
                  </Typography>
                </li>
              </Box>

              <Typography variant="h5" gutterBottom color="primary">
                Content Submissions
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be accurate:</strong> Provide clear, accurate descriptions and learning points for move submissions
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Give credit:</strong> Acknowledge original creators or sources when submitting moves or content
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Quality focus:</strong> Submit high-quality content that genuinely helps others learn and improve
                  </Typography>
                </li>
              </Box>


              <Typography variant="h5" gutterBottom color="primary">
                Prohibited Behavior
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>No inappropriate content:</strong> Keep all content family-friendly and appropriate for all ages
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>No misinformation:</strong> Avoid sharing incorrect information about dance techniques or safety
                  </Typography>
                </li>
              </Box>

              <Typography variant="h5" gutterBottom color="primary">
                Enforcement
              </Typography>
              <Typography variant="body1" paragraph>
                Community moderators review all submissions. Content that violates these guidelines may result in content removal. 
                We believe in education and growth, so submissions are reviewed to ensure they meet our quality and safety standards.
              </Typography>

              <Typography variant="h5" gutterBottom color="primary">
                Questions and Feedback
              </Typography>
              <Typography variant="body1">
                These guidelines may evolve as our community grows. If you have questions about these guidelines or suggestions 
                for improvement, please reach out through our contact page. We value community input in shaping our shared space.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
};

export default CommunityGuidelinesPage;