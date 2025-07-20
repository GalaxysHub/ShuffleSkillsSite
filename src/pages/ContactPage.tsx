import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { 
  ContactMail, 
  Send,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      let userIp = '';
      
      // Get user's IP address
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIp = ipData.ip;
      } catch (ipError) {
        console.warn('Could not fetch IP address:', ipError);
      }
      
      // Add to Firebase
      await addDoc(collection(db, "contact-inquiries"), {
        ...formData,
        submitterIp: userIp,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
        status: "new", // Track inquiry status
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Contact Form */}
        <Stack spacing={4}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                Send us a Message
              </Typography>
              <Typography variant="body1" paragraph>
                We'd love to hear from you! Whether you have questions, feedback, 
                or suggestions for improving the Shuffle Skill Tree, don't hesitate 
                to reach out.
              </Typography>
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    required
                    disabled={loading}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    disabled={loading}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Stack>
              </Box>
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