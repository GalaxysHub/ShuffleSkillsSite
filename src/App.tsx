import { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import SkillTreePage from './pages/SkillTreePage';
import HistoryPage from './pages/HistoryPage';
import ContactPage from './pages/ContactPage';
import UploadMovePage from './pages/UploadMovePage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import FAQPage from './pages/FAQPage';
import ContributionsPage from './pages/ContributionsPage';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    typography: {
      fontFamily: '"Rajdhani", "Exo 2", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Orbitron", "Rajdhani", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Orbitron", "Rajdhani", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Orbitron", "Rajdhani", sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 600,
      },
      button: {
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#00ffff' : '#1a237e', // Cyan for dark, deep blue for light
        light: darkMode ? '#66ffff' : '#534bae',
        dark: darkMode ? '#00cccc' : '#000051',
      },
      secondary: {
        main: darkMode ? '#ff0099' : '#e91e63', // Hot pink/magenta
        light: darkMode ? '#ff66bb' : '#ff5983',
        dark: darkMode ? '#cc0077' : '#b0003a',
      },
      success: {
        main: darkMode ? '#39ff14' : '#2e7d32', // Neon green for dark
      },
      warning: {
        main: darkMode ? '#ffff00' : '#f57c00', // Neon yellow for dark
      },
      error: {
        main: darkMode ? '#ff073a' : '#d32f2f', // Neon red for dark
      },
      ...(darkMode && {
        background: {
          default: '#0a0a0a', // Deep black
          paper: '#1a1a1a', // Dark gray
        },
        text: {
          primary: '#ffffff',
          secondary: '#cccccc',
        },
        divider: '#333333',
      }),
      ...(!darkMode && {
        background: {
          default: '#f8f9fa', // Light gray
          paper: '#ffffff',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#666666',
        },
        divider: '#e0e0e0',
      }),
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
            backdropFilter: 'blur(10px)',
            backgroundColor: darkMode 
              ? 'rgba(26, 26, 26, 0.8)' 
              : 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: darkMode 
                ? '0 8px 32px rgba(0, 255, 255, 0.15)'
                : '0 8px 32px rgba(26, 35, 126, 0.15)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: darkMode 
                ? '0 4px 16px rgba(0, 255, 255, 0.3)'
                : '0 4px 16px rgba(26, 35, 126, 0.3)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Box sx={{ 
          margin: 0, 
          padding: 0,
          minHeight: '100vh',
          background: darkMode
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
        }}>
              <AnalyticsWrapper>
                <Routes>
                  <Route path="/" element={<SkillTreePage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/upload-move" element={<UploadMovePage />} />
                  <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contributions" element={<ContributionsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnalyticsWrapper>
              <Analytics />
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;