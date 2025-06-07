import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Button,
  Grid
} from '@mui/material';
import {
  Save,
  Restore
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast.success(`${setting} actualizado`, { icon: '⚙️' });
  };

  const handleSaveSettings = () => {
    toast.success('¡Configuración guardada!', { icon: '💾' });
  };

  const handleResetSettings = () => {
    setSettings({
      darkMode: true,
      notifications: true,
      autoSave: true
    });
    toast.success('Configuración restaurada', { icon: '🔄' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        ⚙️ Configuración
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
                Configuración General
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: 'white' }}>Modo Oscuro</Typography>
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: 'white' }}>Notificaciones</Typography>
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: 'white' }}>Autoguardado</Typography>
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  startIcon={<Save />}
                  sx={{
                    background: 'linear-gradient(45deg, #00b894, #00cec9)',
                    color: 'white'
                  }}
                >
                  Guardar
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleResetSettings}
                  startIcon={<Restore />}
                  sx={{
                    borderColor: '#fdcb6e',
                    color: '#fdcb6e'
                  }}
                >
                  Restaurar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Settings; 