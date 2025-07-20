import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { 
  Help,
  ExpandMore,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "Is this app free to use?",
      answer: "Yes! Shuffle Skill Tree is completely free to use. You can access all features without any cost."
    },
    {
      question: "How do I suggest new moves?",
      answer: "Use the 'Upload Move' feature in the navigation to submit new move suggestions. Include the move name, description, and any relevant details about prerequisites or difficulty level."
    },
    {
      question: "How do I save my progress?",
      answer: "Progress is automatically saved locally in your browser. For cross-device syncing, you can create a free account using the login button in the navbar."
    },
    {
      question: "Can I contribute to the platform?",
      answer: "We welcome contributions! Use the contact form to let us know how you'd like to help improve the Shuffle Skill Tree, or submit moves through our upload feature."
    },
    {
      question: "What file formats are supported for move uploads?",
      answer: "We support GIF files and video formats including MP4, MOV, and AVI. Files must be under 50MB for optimal performance."
    },
    {
      question: "How are submitted moves reviewed?",
      answer: "All submitted moves go through a review process by our team before being added to the skill tree. We check for accuracy, quality, and adherence to community guidelines."
    },
    {
      question: "What shuffle styles are covered?",
      answer: "The skill tree covers multiple shuffle styles including Melbourne Shuffle, Shapes, and various freestyle techniques. Each move is tagged with its applicable styles."
    },
    {
      question: "How should I progress through the moves?",
      answer: "Start with beginner moves like Running Man and T-Step. The skill tree shows prerequisites for each move, so follow the progression paths to build your skills systematically."
    },
    {
      question: "Can I practice without music?",
      answer: "While you can practice the physical movements without music, shuffle dance is inherently musical. We recommend practicing with music to develop proper rhythm and timing."
    },
    {
      question: "What if I can't perform a prerequisite move?",
      answer: "Focus on mastering prerequisite moves before attempting advanced techniques. The skill tree is designed to build your abilities progressively for safety and effectiveness."
    },
    {
      question: "How do I reset my progress?",
      answer: "Currently, progress is stored locally. You can clear your browser data to reset progress, or contact us if you need assistance with account-based progress."
    },
    {
      question: "Are there difficulty levels?",
      answer: "Yes! Moves are categorized as Beginner, Intermediate, or Advanced. This helps you choose appropriate challenges based on your current skill level."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Yes, the Shuffle Skill Tree is designed to work on both desktop and mobile devices. The interface adapts to different screen sizes for optimal viewing."
    },
    {
      question: "How often is new content added?",
      answer: "We regularly review and add new community-submitted moves. The frequency depends on submission quality and our review capacity."
    },
    {
      question: "What if I find incorrect information?",
      answer: "If you notice any errors or have suggestions for improvements, please contact us through the contact form. We appreciate community feedback to maintain accuracy."
    }
  ];

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
            <Help
              sx={{ mr: 2, verticalAlign: "middle", fontSize: "inherit" }}
            />
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find answers to common questions about the Shuffle Skill Tree
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
              Common Questions
            </Typography>
            
            <Typography variant="body1" paragraph>
              Here are answers to the most frequently asked questions about using the Shuffle Skill Tree, 
              contributing content, and progressing through your shuffle dance journey.
            </Typography>

            <Box sx={{ mt: 4 }}>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="h6" color="primary">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Still have questions?
              </Typography>
              <Typography variant="body1">
                If you can't find the answer you're looking for, feel free to reach out through our 
                contact form. We're here to help you make the most of your shuffle dance journey!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </Box>
  );
};

export default FAQPage;