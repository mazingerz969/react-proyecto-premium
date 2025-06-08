import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Button,
  Tooltip,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab
} from '@mui/material';
import {
  Palette,
  AutoAwesome,
  Shuffle,
  Close,
  Preview,
  Schedule,
  Brightness4,
  Brightness7,
  Settings
} from '@mui/icons-material';
import { 
  FaRocket, 
  FaMagic, 
  FaPalette, 
  FaEye,
  FaRandom,
  FaClock,
  FaFire,
  FaGem,
  FaSnowflake,
  FaLeaf
} from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider';
import toast from 'react-hot-toast';

const ThemeSelector = () => {
  const { 
    currentTheme, 
    themes, 
    theme, 
    autoTheme, 
    changeTheme, 
    toggleAutoTheme, 
    getRandomTheme 
  } = useTheme();
  
  const [open, setOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(null);

  const themeIcons = {
    default: FaRocket,
    cyberpunk: FaFire,
    neon: FaMagic,
    minimal: FaSnowflake,
    ocean: FaLeaf,
    sunset: FaGem,
    matrix: FaEye
  };

  const ThemePreviewCard = ({ themeName, themeData, isActive, onSelect, onPreview }) => {
    const Icon = themeIcons[themeName] || FaPalette;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          sx={{
            background: isActive 
              ? `linear-gradient(135deg, ${themeData.primary}, ${themeData.secondary})`
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: isActive 
              ? `2px solid ${themeData.accentColor}` 
              : '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            height: 160,
            transition: 'all 0.3s ease'
          }}
          onClick={() => onSelect(themeName)}
          onMouseEnter={() => onPreview(themeName)}
          onMouseLeave={() => onPreview(null)}
        >
          {/* Badge para tema activo */}
          {isActive && (
            <Badge
              badgeContent="ACTIVO"
              color="secondary"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                '& .MuiBadge-badge': {
                  backgroundColor: themeData.accentColor,
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.6rem'
                }
              }}
            />
          )}

          <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header con ícono */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${themeData.primary}, ${themeData.secondary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: themeData.special?.neonGlow || `0 4px 15px ${themeData.shadowColor}`
                }}
              >
                <Icon style={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: 'white',
                  textShadow: themeData.special?.textShadow || 'none'
                }}>
                  {themeData.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, color: 'white' }}>
                  {themeData.description}
                </Typography>
              </Box>
            </Box>

            {/* Preview de colores */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {[themeData.primary, themeData.secondary, themeData.accentColor].map((color, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: `0 2px 8px ${color}50`
                  }}
                />
              ))}
            </Box>

            {/* Efectos especiales */}
            {themeData.special && (
              <Chip
                label="PREMIUM"
                size="small"
                sx={{
                  backgroundColor: themeData.accentColor,
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  boxShadow: themeData.special.neonGlow,
                  alignSelf: 'flex-start'
                }}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const handleThemeSelect = (themeName) => {
    changeTheme(themeName);
    if (autoTheme) {
      toggleAutoTheme(); // Desactivar auto-theme al seleccionar manualmente
      toast.info('🔒 Modo automático desactivado', { duration: 2000 });
    }
  };

  const handleRandomTheme = () => {
    getRandomTheme();
    toast.success('🎲 ¡Tema aleatorio activado!', { 
      icon: '🎨',
      duration: 2000,
      style: {
        background: theme.cardBg,
        color: theme.textColor,
        border: `1px solid ${theme.primary}`
      }
    });
  };

  const currentHour = new Date().getHours();
  const getTimeBasedRecommendation = () => {
    if (currentHour >= 6 && currentHour < 12) return 'ocean'; // Mañana
    if (currentHour >= 12 && currentHour < 18) return 'minimal'; // Tarde  
    if (currentHour >= 18 && currentHour < 22) return 'sunset'; // Atardecer
    return 'cyberpunk'; // Noche
  };

  const recommendedTheme = getTimeBasedRecommendation();

  return (
    <>
      {/* Botón flotante para abrir selector */}
      <Tooltip title="Cambiar Tema" arrow>
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
            boxShadow: `0 6px 20px ${theme.shadowColor}`,
            '&:hover': {
              boxShadow: `0 8px 25px ${theme.shadowColor}`,
              transform: 'scale(1.1)'
            }
          }}
        >
          <Palette />
        </Fab>
      </Tooltip>

      {/* Dialog principal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.glassEffect}`,
            borderRadius: '20px',
            color: theme.textColor
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FaPalette style={{ marginRight: 12, color: theme.primary }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Selector de Temas Premium
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Controles superiores */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoTheme}
                  onChange={toggleAutoTheme}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.accentColor,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.accentColor,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, fontSize: 18 }} />
                  Tema Automático
                </Box>
              }
              sx={{ color: 'white' }}
            />

            <Button
              variant="outlined"
              onClick={handleRandomTheme}
              startIcon={<Shuffle />}
              sx={{
                borderColor: theme.primary,
                color: theme.primary,
                '&:hover': {
                  backgroundColor: `${theme.primary}20`,
                  borderColor: theme.secondary
                }
              }}
            >
              Aleatorio
            </Button>

            {/* Recomendación basada en hora */}
            {!autoTheme && currentTheme !== recommendedTheme && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Tooltip title={`Recomendado para esta hora (${currentHour}:00)`} arrow>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleThemeSelect(recommendedTheme)}
                    startIcon={<AutoAwesome />}
                    sx={{
                      borderColor: themes[recommendedTheme].primary,
                      color: themes[recommendedTheme].primary,
                      fontSize: '0.75rem',
                      '&:hover': {
                        backgroundColor: `${themes[recommendedTheme].primary}20`
                      }
                    }}
                  >
                    Recomendado
                  </Button>
                </Tooltip>
              </motion.div>
            )}
          </Box>

          {/* Grid de temas */}
          <Grid container spacing={2}>
            {Object.entries(themes).map(([themeName, themeData]) => (
              <Grid item xs={12} sm={6} md={4} key={themeName}>
                <ThemePreviewCard
                  themeName={themeName}
                  themeData={themeData}
                  isActive={currentTheme === themeName}
                  onSelect={handleThemeSelect}
                  onPreview={setPreviewTheme}
                />
              </Grid>
            ))}
          </Grid>

          {/* Preview en tiempo real */}
          <AnimatePresence>
            {previewTheme && previewTheme !== currentTheme && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ marginTop: 20 }}
              >
                <Card sx={{
                  background: themes[previewTheme].cardBg,
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${themes[previewTheme].primary}`,
                  padding: 2
                }}>
                  <Typography variant="body2" sx={{ 
                    color: themes[previewTheme].textColor,
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    👁️ Preview: {themes[previewTheme].name}
                  </Typography>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Información del tema actual */}
          <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: theme.glassEffect }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              🎨 Tema Actual: {theme.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              {theme.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Primario: ${theme.primary}`} 
                size="small"
                sx={{ backgroundColor: theme.primary, color: 'white' }}
              />
              <Chip 
                label={`Secundario: ${theme.secondary}`} 
                size="small"
                sx={{ backgroundColor: theme.secondary, color: 'white' }}
              />
              <Chip 
                label={`Acento: ${theme.accentColor}`} 
                size="small"
                sx={{ backgroundColor: theme.accentColor, color: 'black' }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThemeSelector; 