import { createTheme } from '@mui/material/styles';

// 🎨 **Paleta de Colores Premium**
const colors = {
  primary: {
    main: '#667eea',
    light: '#9BB5FF',
    dark: '#3A4BC8',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#764ba2',
    light: '#A478D3',
    dark: '#4A2571',
    contrastText: '#ffffff'
  },
  accent: {
    blue: '#667eea',
    purple: '#764ba2',
    pink: '#fd79a8',
    orange: '#fdcb6e',
    green: '#00b894',
    red: '#e17055',
    gold: '#f1c40f',
    cyan: '#00cec9'
  },
  gradient: {
    primary: 'linear-gradient(45deg, #667eea, #764ba2)',
    secondary: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
    success: 'linear-gradient(45deg, #00b894, #00cec9)',
    warning: 'linear-gradient(45deg, #fdcb6e, #f39c12)',
    error: 'linear-gradient(45deg, #e17055, #f39c12)',
    dark: 'linear-gradient(45deg, #2c3e50, #34495e)',
    light: 'linear-gradient(45deg, #ddd6fe, #e0e7ff)'
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  dark: {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    surface: 'rgba(255, 255, 255, 0.05)',
    card: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)'
  }
};

// 📝 **Tipografías Premium**
const typography = {
  fontFamily: [
    'Inter',
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em'
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em'
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em'
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.00735em'
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0em'
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.0075em'
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.00938em'
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.01071em'
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.02857em',
    textTransform: 'none'
  }
};

// 🎯 **Tema Principal**
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: '#0a0a0a',
      paper: colors.dark.surface
    },
    text: {
      primary: colors.dark.text,
      secondary: colors.dark.textSecondary
    },
    success: {
      main: '#00b894',
      light: '#00cec9',
      dark: '#009673'
    },
    warning: {
      main: '#fdcb6e',
      light: '#ffeaa7',
      dark: '#f39c12'
    },
    error: {
      main: '#e17055',
      light: '#fab1a0',
      dark: '#d63031'
    },
    info: {
      main: '#74b9ff',
      light: '#a7d6ff',
      dark: '#0984e3'
    }
  },
  typography,
  shape: {
    borderRadius: 12
  },
  spacing: 8,
  components: {
    // 📦 **Card Premium**
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.glass.background,
          backdropFilter: colors.glass.backdropFilter,
          border: colors.glass.border,
          borderRadius: 16,
          color: colors.dark.text,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }
        }
      }
    },
    
    // 🔘 **Button Premium**
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)'
          }
        },
        contained: {
          background: colors.gradient.primary,
          '&:hover': {
            background: colors.gradient.primary,
            filter: 'brightness(1.1)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(255,255,255,0.1)'
          }
        }
      }
    },

    // 📄 **Paper Premium**
    MuiPaper: {
      styleOverrides: {
        root: {
          background: colors.glass.background,
          backdropFilter: colors.glass.backdropFilter,
          border: colors.glass.border,
          borderRadius: 16
        }
      }
    },

    // 📝 **TextField Premium**
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.2)',
              borderWidth: 2
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.4)'
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-focused': {
              color: colors.primary.main
            }
          },
          '& .MuiOutlinedInput-input': {
            color: colors.dark.text
          }
        }
      }
    },

    // 📊 **Chip Premium**
    MuiChip: {
      styleOverrides: {
        root: {
          background: colors.glass.background,
          backdropFilter: colors.glass.backdropFilter,
          border: colors.glass.border,
          color: colors.dark.text,
          fontWeight: 500,
          '&:hover': {
            background: 'rgba(255,255,255,0.15)'
          }
        }
      }
    },

    // 🎚️ **Linear Progress Premium**
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.1)'
        },
        bar: {
          borderRadius: 4,
          background: colors.gradient.primary
        }
      }
    },

    // ⚙️ **IconButton Premium**
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.dark.text,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.1)',
            transform: 'scale(1.1)'
          }
        }
      }
    },

    // 🎭 **Avatar Premium**
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: colors.gradient.primary,
          color: colors.dark.text,
          fontWeight: 600,
          border: '2px solid rgba(255,255,255,0.2)'
        }
      }
    },

    // 📋 **Tooltip Premium**
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: colors.glass.background,
          backdropFilter: colors.glass.backdropFilter,
          border: colors.glass.border,
          color: colors.dark.text,
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.875rem'
        }
      }
    },

    // 🎪 **Backdrop Premium**
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }
      }
    },

    // 🎨 **Fab Premium**
    MuiFab: {
      styleOverrides: {
        root: {
          background: colors.gradient.primary,
          color: colors.dark.text,
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          '&:hover': {
            background: colors.gradient.primary,
            filter: 'brightness(1.1)',
            transform: 'scale(1.1)'
          }
        }
      }
    }
  },
  
  // 🎨 **Extensiones personalizadas**
  customColors: colors,
  
  // 🎭 **Mixins personalizados**
  mixins: {
    glassCard: {
      background: colors.glass.background,
      backdropFilter: colors.glass.backdropFilter,
      border: colors.glass.border,
      borderRadius: 16,
      color: colors.dark.text
    },
    gradientButton: (color = 'primary') => ({
      background: colors.gradient[color] || colors.gradient.primary,
      color: colors.dark.text,
      fontWeight: 600,
      borderRadius: 12,
      padding: '12px 24px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        filter: 'brightness(1.1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
      }
    }),
    centerFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spaceBetween: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
});

export default customTheme; 