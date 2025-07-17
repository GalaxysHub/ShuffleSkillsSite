import React from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Stack,
  Link,
  Button,
} from "@mui/material";
import { 
  Email, 
  GitHub, 
  Twitter, 
  ContactMail, 
  Feedback,
  BugReport,
  Lightbulb 
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage: React.FC = () => {
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
      {/* Navbar */}
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
            <ContactMail
              sx={{ mr: 2, verticalAlign: "middle", fontSize: "inherit" }}
            />
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get in touch with the Shuffle Skill Tree community
          </Typography>
        </Box>

        {/* Contact Information */}
        <Stack spacing={4}>
          {/* Main Contact Card */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Get In Touch
              </Typography>
              <Typography variant="body1" paragraph>
                We'd love to hear from you! Whether you have questions, feedback, 
                or suggestions for improving the Shuffle Skill Tree, don't hesitate 
                to reach out.
              </Typography>
              
              <Stack spacing={3} sx={{ mt: 3 }}>
                {/* Email Contact */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6">Email</Typography>
                    <Link
                      href="mailto:contact@shuffleskilltree.com"
                      color="primary"
                      sx={{ textDecoration: "none" }}
                    >
                      contact@shuffleskilltree.com
                    </Link>
                  </Box>
                </Box>

                {/* GitHub */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GitHub sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h6">GitHub</Typography>
                    <Link
                      href="https://github.com/GalaxysHub/ShuffleSkillsSite"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      sx={{ textDecoration: "none" }}
                    >
                      Project Repository
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                      Report bugs, suggest features, or contribute to the project
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Quick Actions
              </Typography>
              
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<BugReport />}
                  href="https://github.com/GalaxysHub/ShuffleSkillsSite/issues/new?template=bug_report.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flex: 1 }}
                >
                  Report a Bug
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<Lightbulb />}
                  href="https://github.com/GalaxysHub/ShuffleSkillsSite/issues/new?template=feature_request.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flex: 1 }}
                >
                  Suggest Feature
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Feedback />}
                  href="mailto:contact@shuffleskilltree.com?subject=Feedback"
                  sx={{ flex: 1 }}
                >
                  Send Feedback
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Community Guidelines
              </Typography>
              
              <Typography variant="body1" paragraph>
                When contacting us, please keep in mind:
              </Typography>
              
              <Box component="ul" sx={{ pl: 3 }}>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be respectful:</strong> We're all here to learn and grow in the shuffle community
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be specific:</strong> When reporting issues, include details about your browser, device, and steps to reproduce
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Be patient:</strong> We're a small team working on this project in our spare time
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Check existing issues:</strong> Before creating a new GitHub issue, check if someone has already reported it
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Frequently Asked Questions
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" color="primary">
                    Q: Is this app free to use?
                  </Typography>
                  <Typography variant="body1">
                    A: Yes! Shuffle Skill Tree is completely free and open-source. 
                    You can use it without any cost or registration required.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="primary">
                    Q: Can I contribute to the project?
                  </Typography>
                  <Typography variant="body1">
                    A: Absolutely! We welcome contributions of all kinds - code, 
                    documentation, move suggestions, or feedback. Check out our GitHub 
                    repository to get started.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="primary">
                    Q: How do I save my progress?
                  </Typography>
                  <Typography variant="body1">
                    A: Progress is automatically saved locally in your browser. For 
                    cross-device syncing, you can create a free account using the 
                    login button in the navbar.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="primary">
                    Q: Are there video tutorials for the moves?
                  </Typography>
                  <Typography variant="body1">
                    A: Video tutorials are planned for future updates. Currently, 
                    each move includes detailed descriptions and key learning points 
                    to help you understand the techniques.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default ContactPage;