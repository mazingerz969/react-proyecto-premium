import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  TextField,
  Box,
  Divider,
  IconButton,
  Tab,
  Tabs,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Close,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  LoginOutlined,
  PersonAddOutlined
} from '@mui/icons-material';
import { FaGoogle, FaGithub, FaDiscord, FaTwitter, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ open, onClose, onAuthSuccess }) => {
  const { theme } = useTheme();
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithGitHub, 
    authLoading 
  } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLogin = async (provider) => {
    try {
      let user;
      
      switch (provider) {
        case 'Google':
          user = await signInWithGoogle();
          break;
        case 'GitHub':
          user = await signInWithGitHub();
          break;
        default:
          toast.error(`${provider} no está disponible aún`);
          return;
      }
      
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }
      
      onClose();
    } catch (error) {
      console.error('Error en login social:', error);
      toast.error(`Error al iniciar sesión con ${provider}`);
    }
  };

  const handleEmailAuth = async () => {
    try {
      if (currentTab === 0) {
        // Login
        if (!formData.email || !formData.password) {
          toast.error('Por favor completa todos los campos');
          return;
        }
        
        const user = await signInWithEmail(formData.email, formData.password);
        if (onAuthSuccess) {
          onAuthSuccess(user);
        }
      } else {
        // Registro
        if (!formData.email || !formData.password || !formData.name) {
          toast.error('Por favor completa todos los campos');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
        
        const user = await signUpWithEmail(formData.email, formData.password, formData.name);
        if (onAuthSuccess) {
          onAuthSuccess(user);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error en autenticación:', error);
      
      // Manejar errores específicos de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('Usuario no encontrado');
          break;
        case 'auth/wrong-password':
          toast.error('Contraseña incorrecta');
          break;
        case 'auth/email-already-in-use':
          toast.error('El email ya está en uso');
          break;
        case 'auth/weak-password':
          toast.error('La contraseña debe tener al menos 6 caracteres');
          break;
        case 'auth/invalid-email':
          toast.error('Email inválido');
          break;
        default:
          toast.error('Error en la autenticación');
      }
    }
  };

  const socialProviders = [
    { name: 'Google', icon: FaGoogle, color: '#db4437' },
    { name: 'GitHub', icon: FaGithub, color: '#333' },
    { name: 'Discord', icon: FaDiscord, color: '#7289da' },
    { name: 'Twitter', icon: FaTwitter, color: '#1da1f2' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          color: 'white',
          position: 'relative'
        }}>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              color: 'white'
            }}
          >
            <Close />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FaRocket style={{ fontSize: 32, marginRight: 12 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Ultimate Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Accede a funciones premium
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            centered
          >
            <Tab label="Login" icon={<LoginOutlined />} />
            <Tab label="Registro" icon={<PersonAddOutlined />} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Acceso rápido
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin(provider.name)}
                disabled={authLoading}
                startIcon={<provider.icon />}
                sx={{
                  py: 1.5,
                  borderColor: provider.color,
                  color: provider.color
                }}
              >
                {provider.name}
              </Button>
            ))}
          </Box>

          <Divider sx={{ my: 3 }}>
            <Chip label="O" />
          </Divider>

          {currentTab === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleEmailAuth}
                disabled={authLoading}
                sx={{ py: 1.5, mt: 2 }}
              >
                {authLoading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleEmailAuth}
                disabled={authLoading}
                sx={{ py: 1.5, mt: 2 }}
              >
                {authLoading ? <CircularProgress size={24} /> : 'Crear Cuenta'}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 