import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import toast from 'react-hot-toast';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

// Definición de temas premium
const themes = {
  default: {
    name: 'Default Premium',
    description: 'Tema original con gradientes violetas',
    primary: '#667eea',
    secondary: '#764ba2',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    glassEffect: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    particleColor: '#667eea'
  },
  cyberpunk: {
    name: 'Cyberpunk 2077',
    description: 'Tema futurista inspirado en cyberpunk',
    primary: '#00f5ff',
    secondary: '#ff0080',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a0033 50%, #330066 100%)',
    cardBg: 'rgba(0, 245, 255, 0.1)',
    textColor: '#00f5ff',
    accentColor: '#ff0080',
    glassEffect: 'rgba(0, 245, 255, 0.15)',
    shadowColor: 'rgba(255, 0, 128, 0.4)',
    particleColor: '#00f5ff',
    special: {
      neonGlow: '0 0 20px #00f5ff, 0 0 40px #00f5ff',
      borderGlow: '1px solid #00f5ff',
      textShadow: '0 0 10px #00f5ff'
    }
  },
  neon: {
    name: 'Neon Dreams',
    description: 'Colores neón vibrantes y brillantes',
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
    cardBg: 'rgba(255, 107, 107, 0.1)',
    textColor: '#ffffff',
    accentColor: '#feca57',
    glassEffect: 'rgba(255, 107, 107, 0.15)',
    shadowColor: 'rgba(255, 107, 107, 0.4)',
    particleColor: '#ff6b6b',
    special: {
      neonGlow: '0 0 15px #ff6b6b, 0 0 30px #4ecdc4',
      borderGlow: '1px solid #ff6b6b',
      textShadow: '0 0 8px #ff6b6b'
    }
  },
  minimal: {
    name: 'Minimal Dark',
    description: 'Elegancia minimalista en tonos oscuros',
    primary: '#2c3e50',
    secondary: '#34495e',
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    cardBg: 'rgba(52, 73, 94, 0.8)',
    textColor: '#ecf0f1',
    accentColor: '#e74c3c',
    glassEffect: 'rgba(52, 73, 94, 0.9)',
    shadowColor: 'rgba(52, 152, 219, 0.3)',
    particleColor: '#3498db'
  },
  ocean: {
    name: 'Deep Ocean',
    description: 'Profundidades marinas azules',
    primary: '#0984e3',
    secondary: '#74b9ff',
    background: 'linear-gradient(135deg, #0c2461 0%, #0984e3 50%, #74b9ff 100%)',
    cardBg: 'rgba(116, 185, 255, 0.1)',
    textColor: '#ffffff',
    accentColor: '#00cec9',
    glassEffect: 'rgba(116, 185, 255, 0.15)',
    shadowColor: 'rgba(9, 132, 227, 0.4)',
    particleColor: '#74b9ff'
  },
  sunset: {
    name: 'Cosmic Sunset',
    description: 'Atardecer cósmico naranja y rosa',
    primary: '#fd79a8',
    secondary: '#fdcb6e',
    background: 'linear-gradient(135deg, #2d3436 0%, #fd79a8 50%, #fdcb6e 100%)',
    cardBg: 'rgba(253, 121, 168, 0.1)',
    textColor: '#ffffff',
    accentColor: '#e84393',
    glassEffect: 'rgba(253, 121, 168, 0.15)',
    shadowColor: 'rgba(253, 203, 110, 0.4)',
    particleColor: '#fd79a8'
  },
  matrix: {
    name: 'Matrix Code',
    description: 'Inspirado en The Matrix - Verde digital',
    primary: '#00ff41',
    secondary: '#00d835',
    background: 'linear-gradient(135deg, #000000 0%, #0d1b0d 50%, #1a2d1a 100%)',
    cardBg: 'rgba(0, 255, 65, 0.1)',
    textColor: '#00ff41',
    accentColor: '#39ff00',
    glassEffect: 'rgba(0, 255, 65, 0.15)',
    shadowColor: 'rgba(0, 255, 65, 0.4)',
    particleColor: '#00ff41',
    special: {
      neonGlow: '0 0 10px #00ff41, 0 0 20px #00ff41',
      borderGlow: '1px solid #00ff41',
      textShadow: '0 0 5px #00ff41'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [autoTheme, setAutoTheme] = useState(false);

  // Cargar tema guardado al inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedAutoTheme = localStorage.getItem('autoTheme') === 'true';
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setAutoTheme(savedAutoTheme);

    if (savedAutoTheme) {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        setCurrentTheme('minimal'); // Día
      } else if (hour >= 18 && hour < 22) {
        setCurrentTheme('sunset'); // Atardecer
      } else {
        setCurrentTheme('cyberpunk'); // Noche
      }
    }
  }, []);

  // Auto-cambio de tema según la hora
  useEffect(() => {
    if (!autoTheme) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      let newTheme = 'default';
      
      if (hour >= 6 && hour < 12) newTheme = 'ocean'; // Mañana
      else if (hour >= 12 && hour < 18) newTheme = 'minimal'; // Tarde
      else if (hour >= 18 && hour < 22) newTheme = 'sunset'; // Atardecer
      else newTheme = 'cyberpunk'; // Noche
      
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
        toast.success(`🎨 Tema cambiado automáticamente: ${themes[newTheme].name}`, {
          duration: 3000,
          icon: '🌅'
        });
      }
    };

    const interval = setInterval(checkTime, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [autoTheme, currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
      toast.success(`🎨 Tema cambiado: ${themes[themeName].name}`, {
        duration: 2000,
        style: {
          background: themes[themeName].cardBg,
          color: themes[themeName].textColor,
          border: `1px solid ${themes[themeName].primary}`
        }
      });
    }
  };

  const toggleAutoTheme = () => {
    const newAutoTheme = !autoTheme;
    setAutoTheme(newAutoTheme);
    localStorage.setItem('autoTheme', newAutoTheme.toString());
    
    if (newAutoTheme) {
      toast.success('🕐 Tema automático activado', {
        icon: '⚡',
        duration: 2000
      });
    } else {
      toast.success('🔒 Tema manual activado', {
        icon: '🎯',
        duration: 2000
      });
    }
  };

  const getRandomTheme = () => {
    const themeNames = Object.keys(themes).filter(name => name !== currentTheme);
    const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
    changeTheme(randomTheme);
  };

  // Crear tema Material-UI basado en el tema actual
  const muiTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: themes[currentTheme].primary,
      },
      secondary: {
        main: themes[currentTheme].secondary,
      },
      background: {
        default: '#000000',
        paper: themes[currentTheme].cardBg,
      },
      text: {
        primary: themes[currentTheme].textColor,
        secondary: themes[currentTheme].textColor,
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { color: themes[currentTheme].textColor },
      h2: { color: themes[currentTheme].textColor },
      h3: { color: themes[currentTheme].textColor },
      h4: { color: themes[currentTheme].textColor },
      h5: { color: themes[currentTheme].textColor },
      h6: { color: themes[currentTheme].textColor },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: themes[currentTheme].cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${themes[currentTheme].glassEffect}`,
            boxShadow: `0 8px 32px ${themes[currentTheme].shadowColor}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            background: `linear-gradient(45deg, ${themes[currentTheme].primary}, ${themes[currentTheme].secondary})`,
            border: 0,
            borderRadius: 25,
            boxShadow: `0 3px 10px ${themes[currentTheme].shadowColor}`,
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              boxShadow: `0 6px 20px ${themes[currentTheme].shadowColor}`,
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: themes[currentTheme].cardBg,
            color: themes[currentTheme].textColor,
            border: `1px solid ${themes[currentTheme].primary}`,
          },
        },
      },
    },
  });

  const themeContextValue = {
    currentTheme,
    themes,
    theme: themes[currentTheme],
    isDarkMode,
    autoTheme,
    changeTheme,
    toggleAutoTheme,
    getRandomTheme,
    setIsDarkMode,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div
          style={{
            background: themes[currentTheme].background,
            minHeight: '100vh',
            transition: 'all 0.3s ease',
          }}
        >
          {children}
        </div>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 