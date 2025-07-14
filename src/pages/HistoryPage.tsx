import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  Chip,
  Stack,
  Link,
} from '@mui/material';
import {
  History,
  Timeline,
  MusicNote,
  Groups,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HistoryPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      {/* Navbar */}
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: '"Orbitron", sans-serif' }}>
            <History sx={{ mr: 2, verticalAlign: 'middle', fontSize: 'inherit' }} />
            Dance History & Origins
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore the rich cultural heritage behind shuffle dance moves
          </Typography>
        </Box>

        {/* Timeline Introduction */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))' }}>
          <Typography variant="h5" gutterBottom>
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            From Cultural Roots to Modern Shuffle
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Modern shuffle dance is built upon centuries of cultural evolution, blending influences from African-American traditions, 
            jazz age innovations, and electronic music culture. Each move carries its own unique story and historical significance.
          </Typography>
        </Paper>

        {/* Dance Move Histories */}
        <Stack spacing={4}>
          {/* Charleston */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontFamily: '"Orbitron", sans-serif' }}>
                  Charleston
                </Typography>
                <Chip 
                  label="1920s" 
                  color="primary" 
                  sx={{ ml: 2, fontWeight: 'bold' }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom color="primary">
                <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                African-American Cultural Heritage
              </Typography>
              <Typography variant="body1" paragraph>
                The Charleston dance traces its roots to the <strong>African Juba dance</strong>, brought to Charleston, 
                South Carolina by enslaved Africans from the Kongo region between 1735-1740. Originally known as a black 
                folk dance throughout the American South, it involved "patting" ("Pattin' Juba") - rhythmic stamping, 
                slapping of chest and arms, and clapping.
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                <MusicNote sx={{ mr: 1, verticalAlign: 'middle' }} />
                Jazz Age Explosion (1920s)
              </Typography>
              <Typography variant="body1" paragraph>
                The Charleston exploded into mainstream popularity in the 1920s with the Broadway song "The Charleston" 
                by <strong>James P. Johnson</strong> from the show "Runnin' Wild" (1923-1924). Characterized by lively, 
                frenetic movements, it became one of the greatest dance crazes in American history and was considered 
                "wild" for its time.
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                Modern Legacy
              </Typography>
              <Typography variant="body1" paragraph>
                The Charleston's signature "kick forward, walk back, kick back, walk forward" pattern with swinging arms 
                evolved into swing dance foundations. Its influence on Lindy Hop and modern swing styles eventually 
                found its way into contemporary shuffle dance through shared rhythmic elements and energetic footwork patterns.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <strong>Key Elements:</strong> High energy kicks • Swinging arms • Syncopated rhythms • Sharp directional changes
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  <strong>Sources:</strong>{' '}
                  <Link href="https://en.wikipedia.org/wiki/Charleston_(dance)" target="_blank" rel="noopener">
                    Wikipedia - Charleston (dance)
                  </Link>
                  {' • '}
                  <Link href="https://www.britannica.com/art/Charleston-dance" target="_blank" rel="noopener">
                    Britannica - Charleston
                  </Link>
                  {' • '}
                  <Link href="https://secretsofsolo.com/2020/08/the-history-of-the-charleston-dance/" target="_blank" rel="noopener">
                    Secrets of Solo - Charleston History
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Running Man */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontFamily: '"Orbitron", sans-serif' }}>
                  Running Man
                </Typography>
                <Chip 
                  label="Late 1980s" 
                  color="secondary" 
                  sx={{ ml: 2, fontWeight: 'bold' }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom color="secondary">
                <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                Hip-Hop Culture Origins
              </Typography>
              <Typography variant="body1" paragraph>
                The Running Man emerged from the <strong>late 1980s hip-hop scene</strong> as an iconic dance move 
                featuring in-place running motion. While its exact origins are debated, it gained widespread recognition 
                through performances by artists like MC Hammer and Bobby Brown, with early appearances in music videos 
                such as Run-D.M.C.'s "Run's House" (1988).
              </Typography>

              <Typography variant="h6" gutterBottom color="secondary">
                Cultural Impact & Evolution
              </Typography>
              <Typography variant="body1" paragraph>
                Unlike traditional breakdancing moves which focused on toprock, footwork, power moves, and freezes, 
                the Running Man represented a separate branch of hip-hop dance that emphasized rhythm and accessibility. 
                It achieved massive popularity during the early to mid-1990s and later experienced a revival through 
                internet memes in the late 2000s.
              </Typography>

              <Typography variant="h6" gutterBottom color="secondary">
                Shuffle Dance Foundation
              </Typography>
              <Typography variant="body1" paragraph>
                The Running Man's emphasis on weight distribution on the balls of feet, rhythmic consistency, and 
                in-place motion made it a perfect foundation for Melbourne shuffle. Its adaptability allowed for 
                variations like the reverse running man and integration with other shuffle elements.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <strong>Key Elements:</strong> In-place running motion • Weight on balls of feet • Consistent rhythm • Building block for combinations
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  <strong>Sources:</strong>{' '}
                  <Link href="https://en.wikipedia.org/wiki/Running_man_(dance)" target="_blank" rel="noopener">
                    Wikipedia - Running man (dance)
                  </Link>
                  {' • '}
                  <Link href="https://www.liveabout.com/running-man-dance-1007148" target="_blank" rel="noopener">
                    LiveAbout - Running Man Dance
                  </Link>
                  {' • '}
                  <Link href="https://dancewithceech.com/hip-hop-dance-move-running-man/" target="_blank" rel="noopener">
                    Dance with Ceech - Running Man
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* T-Step */}
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontFamily: '"Orbitron", sans-serif' }}>
                  T-Step
                </Typography>
                <Chip 
                  label="Late 1980s-1990s" 
                  color="warning" 
                  sx={{ ml: 2, fontWeight: 'bold' }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom color="warning.main">
                <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                Melbourne Underground Rave Scene
              </Typography>
              <Typography variant="body1" paragraph>
                The T-Step originated in <strong>Melbourne's underground rave scene</strong> during the late 1980s and 
                early 1990s as a core component of what locals called "stomping." This heel-toe footwork technique 
                became fundamental to the Melbourne shuffle style that emerged from Australia's electronic music culture.
              </Typography>

              <Typography variant="h6" gutterBottom color="warning.main">
                Technical Innovation
              </Typography>
              <Typography variant="body1" paragraph>
                The T-Step's distinctive <strong>fast heel-and-toe movement with ankle twisting</strong> created the 
                characteristic T-shaped foot positioning that gave the move its name. This technique, combined with 
                weight shifting and precise timing, produced the iconic "gliding illusion" that became synonymous 
                with shuffle dance.
              </Typography>

              <Typography variant="h6" gutterBottom color="warning.main">
                Evolution & Modern Influence
              </Typography>
              <Typography variant="body1" paragraph>
                While the Running Man eventually became more dominant in shuffle culture, the T-Step remained essential 
                as a foundational building block. Its influence led to variations like V-steps and different leg dragging 
                techniques, and it continues to be taught as a core technique in modern shuffle and cutting shapes tutorials.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <strong>Key Elements:</strong> Fast heel-toe movement • T-shaped positioning • Gliding effect • Essential for advanced combinations
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  <strong>Sources:</strong>{' '}
                  <Link href="https://en.wikipedia.org/wiki/Melbourne_shuffle" target="_blank" rel="noopener">
                    Wikipedia - Melbourne shuffle
                  </Link>
                  {' • '}
                  <Link href="https://www.vice.com/en/article/thumps-illustrated-guide-to-the-hardstyle-shuffle/" target="_blank" rel="noopener">
                    VICE - Hardstyle Shuffle Guide
                  </Link>
                  {' • '}
                  <Link href="https://trendy-dancing.wonderhowto.com/how-to/do-melbourne-shuffle-t-step-271787/" target="_blank" rel="noopener">
                    WonderHowTo - Melbourne Shuffle T-Step
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Cultural Impact Section */}
        <Paper sx={{ p: 4, mt: 4, background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 87, 34, 0.1))' }}>
          <Typography variant="h5" gutterBottom>
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Cultural Legacy & Modern Shuffle
          </Typography>
          <Typography variant="body1" paragraph>
            These three foundational moves represent different threads in the rich tapestry of dance history:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Charleston:</strong> Preserves African cultural heritage and jazz age innovation
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Running Man:</strong> Bridges hip-hop culture with electronic dance movements
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>T-Step:</strong> Represents Australian rave culture's technical innovation
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Together, they form the foundation of modern shuffle dance, demonstrating how cultural movements 
            across continents and decades can converge into new forms of artistic expression.
          </Typography>
        </Paper>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HistoryPage;